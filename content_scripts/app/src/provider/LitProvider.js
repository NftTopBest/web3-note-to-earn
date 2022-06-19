import LitJsSdk from 'lit-js-sdk';
import { createContext, useRef, useContext } from 'react';
import { dataURLtoBlob } from '../utils/blob';
import { useSubpaseContext } from './SubpaseProvider';
import { useWallet } from './WalletProvider';
export const LitContext = createContext();
export const useLit = () => useContext(LitContext);

const chain = 'rinkeby';
const nftAddress = '0x17f6bdf57384fd9f24f1d9a4681c3a9dc839d79e';

export const LitProvider = ({ children }) => {
  const client = useRef();
  const { createPost, getProvider, ehthersRef } = useSubpaseContext();
  const { account, web3 } = useWallet();
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
    console.log('postInfo ', postInfo);
    console.log('client ', client);
    if (!client.current) return;
    console.log('ethersProvider before', ehthersRef);
    const authSig = await LitJsSdk.signAndSaveAuthMessage({ web3: ehthersRef.current, account, chainId: 4 });
    console.log('ethersProvider after', ehthersRef);
    console.log("authSig ", authSig);

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(postInfo.content);
    const accessControlConditions = getCondition(nftAddress);
    const encryptedSymmetricKey = await client.current?.saveEncryptionKey({
      accessControlConditions,
      symmetricKey, // Uint8Array
      authSig,
      chain,
    });

    console.log('encryptedSymmetricKey ', encryptedSymmetricKey);

    await createPost({
      pinataContent: {
        ...postInfo,
        content: {
          encryptedString,
          encryptedSymmetricKey,
        },
      },
      pinataMetadata: {
        keyvalues: {
          type: 'note',
        },
      },
    });
  };

  const decryptContent = async (toDecrypt, encryptedString) => {
    if (!client.current) return;
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
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

  return (
    <LitContext.Provider
      value={{
        install,
        getCondition,
        encryptPost,
        decryptContent,
      }}
    >
      {children}
    </LitContext.Provider>
  );
};
