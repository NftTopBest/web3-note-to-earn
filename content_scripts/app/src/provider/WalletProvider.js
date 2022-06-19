import React, { useRef, useState } from 'react';
import LitJsSdk from 'lit-js-sdk';
import createMetaMaskProvider from 'metamask-extension-provider';
import Web3 from 'web3';
import axios from 'axios';
import { ethers } from 'ethers';
import { getNormalizeAddress } from '../utils';
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

const PINATA_REQUEST_INFO = {
  withCredentials: true,
  headers: {
    pinata_api_key: 'be04bff72a2d069f4971',
    pinata_secret_api_key: '495565df952a88745dd21c51aa151fc2adb8ffff2795a5eae3efa0f2e3492627',
  },
}


const chain = 'rinkeby';
const nftAddress = '0x17f6bdf57384fd9f24f1d9a4681c3a9dc839d79e';
const baseUrl = 'https://api.pinata.cloud';
const baseEndpoint = `${baseUrl}/data/pinList`;

const getAuthSig = () => {
  const lauthSigRaw = localStorage.getItem('lit-auth-signature');
  const authSig = JSON.parse(lauthSigRaw);
  return authSig;
};

const WalletProvider = React.memo(({ children }) => {
  const [chainId, setChainId] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const ehthersRef = useRef();
  const [isAuthenticated, setAuthenticated] = React.useState(false);
  const [appLoading, setAppLoading] = React.useState(false);

  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);

  const createPost = async (postInfo) => {
    const rz = await axios.post(baseEndpoint, postInfo, PINATA_REQUEST_INFO);
    console.log('====> rz :', rz);
  };

  const getPostList = async (filters) => {
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

  const save = async (formData) => {
    setLoadingInitial(true);
    setError(error?.message ?? '');
    setLoadingInitial(false);

    return error;
  };

  const client = useRef();

  const install = async () => {
    console.log('===>>> LIT network is START');
    const litNodeClient = new LitJsSdk.LitNodeClient();
    await litNodeClient.connect();
    client.current = litNodeClient;
    console.log('===>>> LIT network is DONE!');
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
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(postInfo.content);
      const accessControlConditions = getCondition(nftAddress);

      console.log("log data ", {
        accessControlConditions,
        symmetricKey, // Uint8Array
        authSig,
        chain,
      })

      const encryptedSymmetricKey = await client.current?.saveEncryptionKey({
        accessControlConditions,
        symmetricKey, // Uint8Array
        authSig,
        chain,
      });

      console.log("encryptedSymmetricKey data ", {
        accessControlConditions,
        symmetricKey, // Uint8Array
        authSig,
        chain,
      });


      const content = {
        encryptedString: await blobToDataURL(encryptedString),
        encryptedSymmetricKey: await LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
      };

      console.log("content ", content);
      console.log("postInfo ", postInfo);

      await createPost({
        pinataContent: {
          ...postInfo,
          content,
        },
        pinataMetadata: {
          keyvalues: {
            type: 'note',
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

      encryptedString = dataURLtoBlob(encryptedString);
      const decryptedString = await LitJsSdk.decryptString(encryptedString, symmetricKey);

      return { decryptedString };
    } catch (err) {
      console.log('====> err :', err);
      return { err };
    }
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
        web3,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
});

export default WalletProvider;
