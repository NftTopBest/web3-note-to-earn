import React, { useRef } from 'react';
import createMetaMaskProvider from 'metamask-extension-provider';
import Web3 from 'web3';
import axios from 'axios';
import { ethers } from 'ethers';
import LitJsSdk from 'lit-js-sdk';
// utils
import { getNormalizeAddress, getAuthSig, nftAddress, chain, PINATA_REQUEST_INFO, handlerDecrypt } from '../utils';
import { EthereumEvents } from '../utils/events';
import { blobToDataURL, dataURLtoBlob } from '../utils/blob';
import storage from '../utils/storage';
import queryBuilder from '../utils/querybuilder';

export const WalletContext = React.createContext();
export const useWallet = () => React.useContext(WalletContext);

export function withWallet(Component) {
  const WalletComponent = (props) => (
    <WalletContext.Consumer>{(contexts) => <Component {...props} {...contexts} />}</WalletContext.Consumer>
  );
  return WalletComponent;
}

const metadataFilter = {
  keyvalues: {
    type: {
      value: 'notes-demo',
      op: 'eq',
    },
  },
};

const filters = {
  status: 'pinned',
  pageLimit: 10,
  pageOffset: 0,
  metadata: metadataFilter,
};

const WalletProvider = React.memo(({ children }) => {
  const [chainId, setChainId] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAuthenticated, setAuthenticated] = React.useState(false);
  const [appLoading, setAppLoading] = React.useState(false);
  const client = useRef();
  const ehthersRef = useRef();

  const createPost = async (postInfo) => {
    const baseUrl = 'https://api.pinata.cloud';
    const endpoint = `${baseUrl}/pinning/pinJSONToIPFS`;
    const rz = await axios.post(endpoint, postInfo, PINATA_REQUEST_INFO);
    console.log('====> rz :', rz);
  };

  const getPostList = async (filters) => {
    const baseUrl = 'https://api.pinata.cloud';
    const baseEndpoint = `${baseUrl}/data/pinList`;
    const endpoint = queryBuilder(baseEndpoint, filters);
    const result = await axios.get(endpoint, PINATA_REQUEST_INFO);
    if (result.status !== 200) {
      new Error(`unknown server response while attempting to retrieve user pin list: ${result}`);
    }
    const hashList = result?.data?.rows.map(({ ipfs_pin_hash }) => ipfs_pin_hash);
    const requestArr = hashList.map(async (id) => {
      const rz = await axios.get(`https://gateway.pinata.cloud/ipfs/${id}`);
      return {
        id,
        ...rz.data,
      };
    });
    return await Promise.all(requestArr);
  };

  const getCondition = () => {
    return [
      {
        contractAddress: nftAddress,
        standardContractType: 'ERC721',
        chain,
        method: 'balanceOf',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>',
          value: '0',
        },
      },
    ];
  };

  const encryptPost = async (postInfo) => {
    if (!client.current) return;

    try {
      await LitJsSdk.signAndSaveAuthMessage({ web3: ehthersRef.current, account, chainId: 4 });
      const authSig = getAuthSig();
      console.log('authSig ', authSig);
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(postInfo.content);
      const accessControlConditions = getCondition(nftAddress);
      const encryptedSymmetricKey = await client.current?.saveEncryptionKey({
        accessControlConditions,
        symmetricKey, // Uint8Array
        authSig,
        chain,
      });

      console.log('encryptedSymmetricKey data ', {
        encryptedSymmetricKey,
      });

      const encryptedStringString = await blobToDataURL(encryptedString);
      const encryptedSymmetricKeyString = await LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16');

      await createPost({
        pinataContent: {
          ...postInfo,
          content: {
            encryptedString: encryptedStringString,
            encryptedSymmetricKey: encryptedSymmetricKeyString,
          },
        },
        pinataMetadata: {
          keyvalues: {
            type: 'notes-demo',
          },
        },
      });
    } catch (err) {
      console.log('err ', err);
    }
  };

  const decryptContent = async (toDecrypt, encryptedString) => {
    if (!client.current) return;
    await LitJsSdk.signAndSaveAuthMessage({ web3: ehthersRef.current, account, chainId: 4 });
    const authSig = getAuthSig();
    const accessControlConditions = getCondition(nftAddress);
    try {
      const symmetricKey = await client.current?.getEncryptionKey({
        accessControlConditions,
        toDecrypt,
        chain,
        authSig,
      });

      const newEncryptedString = dataURLtoBlob(encryptedString);

      console.log('newEncryptedString ', newEncryptedString);

      const decryptedString = await LitJsSdk.decryptString(newEncryptedString, symmetricKey);

      console.log('decryptedString ', decryptedString);

      return { decryptedString };
    } catch (err) {
      console.log('====> err :', err);
      return { err };
    }
  };

  const getParsePost = async () => {
    const encryptedPosts = await getPostList(filters);

    return encryptedPosts;
  };

  const showPost = async (data) => {
    const post = await handlerDecrypt(data, decryptContent);
    return post;
  };

  const install = async () => {
    console.log('===>>> LIT network is START');
    const litNodeClient = new LitJsSdk.LitNodeClient();
    await litNodeClient.connect();
    client.current = litNodeClient;
    console.log('===>>> LIT network is DONE!');
  };

  React.useEffect(() => {
    connectEagerly();
    return () => {
      const provider = getProvider();
      unsubscribeToEvents(provider);
    };
  }, []);

  const subscribeToEvents = (provider) => {
    if (provider && provider.on) {
      provider.on(EthereumEvents.CHAIN_CHANGED, handleChainChanged);
      provider.on(EthereumEvents.ACCOUNTS_CHANGED, handleAccountsChanged);
      provider.on(EthereumEvents.CONNECT, handleConnect);
      provider.on(EthereumEvents.DISCONNECT, handleDisconnect);
    }
  };

  const unsubscribeToEvents = (provider) => {
    if (provider && provider.removeListener) {
      provider.removeListener(EthereumEvents.CHAIN_CHANGED, handleChainChanged);
      provider.removeListener(EthereumEvents.ACCOUNTS_CHANGED, handleAccountsChanged);
      provider.removeListener(EthereumEvents.CONNECT, handleConnect);
      provider.removeListener(EthereumEvents.DISCONNECT, handleDisconnect);
    }
  };

  const connectEagerly = async () => {
    const metamask = await storage.get('metamask-connected');
    if (metamask?.connected) {
      await connectWallet();
    }
  };

  const getProvider = () => {
    if (window.ethereum) {
      console.log('found window.ethereum>>');
      return window.ethereum;
    } else {
      const provider = createMetaMaskProvider();
      return provider;
    }
  };

  const getAccounts = async (provider) => {
    if (provider) {
      const [accounts, chainId] = await Promise.all([
        provider.request({
          method: 'eth_requestAccounts',
        }),
        provider.request({ method: 'eth_chainId' }),
      ]);
      return [accounts, chainId];
    }
    return false;
  };

  const connectWallet = async () => {
    console.log('connectWallet runs....');
    try {
      const provider = getProvider();
      const [accounts, chainId] = await getAccounts(provider);
      if (accounts && chainId) {
        setAppLoading(true);
        const account = getNormalizeAddress(accounts);
        const web3 = new Web3(provider);
        const ethersProv = new ethers.providers.Web3Provider(provider);
        ehthersRef.current = ethersProv;
        console.log('ehthersRef.current ', ehthersRef.current);
        console.log('----------------');
        setAccount(account);
        setChainId(chainId);
        setWeb3(web3);
        setAuthenticated(true);
        storage.set('metamask-connected', { connected: true });
        subscribeToEvents(provider);
        install();

        return {
          account,
        };
      }
    } catch (e) {
      console.log('error while connect', e);
    } finally {
      setAppLoading(false);
    }
  };

  const disconnectWallet = () => {
    console.log('disconnectWallet runs');
    try {
      storage.set('metamask-connected', { connected: false });
      setAccount(null);
      setChainId(null);
      setAuthenticated(false);
      setWeb3(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAccountsChanged = (accounts) => {
    setAccount(getNormalizeAddress(accounts));
    console.log('[account changes]: ', getNormalizeAddress(accounts));
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    console.log('[chainId changes]: ', chainId);
  };

  const handleConnect = () => {
    setAuthenticated(true);
    console.log('[connected]');
  };

  const handleDisconnect = () => {
    console.log('[disconnected]');
    disconnectWallet();
  };

  return (
    <WalletContext.Provider
      value={{
        disconnectWallet,
        connectWallet,
        encryptPost,
        getPostList,
        isAuthenticated,
        decryptContent,
        appLoading,
        setAccount,
        install,
        account,
        getParsePost,
        showPost,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
});

export default WalletProvider;
