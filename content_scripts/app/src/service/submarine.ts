import axios from 'axios';

export const tempkey = 'UiqGT6A9hbKEpvrb2WVcyOMiywow8vep';

const config = {
  method: 'post',
  url: 'https://managed.mypinata.cloud/api/v1/content/json',
  headers: {
    'x-api-key': tempkey,
    'Content-Type': 'application/json',
  },
};

/**
 * Set content in Submarin
 * @param content Post string
 * @returns IPFS hash
 */
export const setPost = async (content: string, tags: string[]) => {
  const keyvalues: Record<string, string> = {};
  tags.forEach((tag) => {
    keyvalues.tag = tag;
  });

  const res = await axios({
    ...config,
    data: JSON.stringify({
      content: {
        post: content,
      },
      name: 'Web3 Notes Post',
      metadata: {
        keyvalues,
      },
    }),
  });
  console.log('submarine post data', res.data);
  return res.data;
};

/**
 * Set content in Submarin
 * @param content Post string
 * @returns IPFS hash
 */
export const getPosts = async () => {
  var config = {
    method: 'get',
    url: 'https://managed.mypinata.cloud/api/v1/content',
    headers: {
      'x-api-key': tempkey,
    },
  };

  const res = await axios(config);
  console.log('submarine get post data', res.data);
  return res.data;
};
