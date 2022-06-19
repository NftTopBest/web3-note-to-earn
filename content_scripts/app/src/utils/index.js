export const getNormalizeAddress = (accounts) => {
  return accounts[0] ? accounts[0].toLowerCase() : null;
};

export const PINATA_REQUEST_INFO = {
  withCredentials: true,
  headers: {
    pinata_api_key: 'be04bff72a2d069f4971',
    pinata_secret_api_key: '495565df952a88745dd21c51aa151fc2adb8ffff2795a5eae3efa0f2e3492627',
  },
};

export const chain = 'rinkeby';
export const nftAddress = '0x17f6bdf57384fd9f24f1d9a4681c3a9dc839d79e';

export const getAuthSig = () => {
  const lauthSigRaw = localStorage.getItem('lit-auth-signature');
  const authSig = JSON.parse(lauthSigRaw);
  return authSig;
};

export const handlerDecrypt = async (post, callback) => {
  const result = await callback(post?.content?.encryptedSymmetricKey, post?.content?.encryptedString);


  if (result?.err) {
    console.log('====> err :', result?.err);
    return;
  }

  return {
    ...post,
    content: result?.decryptedString,
  };
};
