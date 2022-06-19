import { createContext, ReactNode, useContext, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import queryBuilder from '../utils/querybuilder';
import axios from 'axios';

const supabaseUrl = 'https://tsjhotxjoptpsjagggbu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzamhvdHhqb3B0cHNqYWdnZ2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ5MTgxODgsImV4cCI6MTk3MDQ5NDE4OH0.lPqtffe2LUwM9-gBQPjtzoPjq57Wne96JuwdFEg8mbE';

const options = {
  schema: 'public',
  headers: { 'x-my-custom-header': 'web3-social' },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const SELECT_POSTS = `
  age, 
  tags, 
  view, 
  email,
  thumb,
  title, 
  author,
  excerpt, 
  content,
  isPublic, 
  updated_at,
  created_at
`;

const AppContext = createContext({});

type SubpaseProviderProps = { children: ReactNode | JSX.Element };

type PostInfoParams = {
  title: string;
  excerpt: string;
  content: string;
};

const SubpaseProvider = ({ children }: SubpaseProviderProps) => {
  const supabase = createClient(supabaseUrl, supabaseKey, options);

  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);

  const createPost = async (postInfo: PostInfoParams) => {
    const baseUrl = 'https://api.pinata.cloud';
    const endpoint = `${baseUrl}/pinning/pinJSONToIPFS`;
    const rz = await axios.post(endpoint, postInfo, {
      withCredentials: true,
      headers: {
        pinata_api_key: 'be04bff72a2d069f4971',
        pinata_secret_api_key: '495565df952a88745dd21c51aa151fc2adb8ffff2795a5eae3efa0f2e3492627',
      },
    });

    console.log('====> rz :', rz);
  };

  const getPostList = async (filters: any) => {
    const baseUrl = 'https://api.pinata.cloud';
    const baseEndpoint = `${baseUrl}/data/pinList`;
    const endpoint = queryBuilder(baseEndpoint, filters);
    const result = await axios.get(endpoint, {
      withCredentials: true,
      headers: {
        pinata_api_key: 'be04bff72a2d069f4971',
        pinata_secret_api_key: '495565df952a88745dd21c51aa151fc2adb8ffff2795a5eae3efa0f2e3492627',
      },
    });
    if (result.status !== 200) {
      new Error(`unknown server response while attempting to retrieve user pin list: ${result}`);
    }
    const hashList = result?.data?.rows.map(({ ipfs_pin_hash }: { ipfs_pin_hash: string }) => ipfs_pin_hash);
    const requestArr = hashList.map(async (id: string) => {
      const rz = await axios.get(`https://gateway.pinata.cloud/ipfs/${id}`);
      return {
        id,
        ...rz.data,
      };
    });
    return await Promise.all(requestArr);
  };

  const save = async (formData: any) => {
    setLoadingInitial(true);
    const { data, error } = await supabase.from('post').insert([formData]);

    setError(error?.message ?? '');
    setLoadingInitial(false);

    return error;
  };

  const getUserPost = async (account: string) => {
    // TODO 错误处理
    const { data, error } = await supabase.from('post').select(SELECT_POSTS).eq('author', account);

    return data;
  };

  const getAllPosts = async (account: string) => {
    // TODO 错误处理
    const { data, error } = await supabase.from('post').select(SELECT_POSTS);
    return data;
  };

  return (
    <AppContext.Provider
      value={{
        supabase,
        auth: supabase.auth,
        messages,
        loadingInitial,
        save,
        error,
        username,
        setUsername,
        getUserPost,
        getAllPosts,
        createPost,
        getPostList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useSubpaseContext = () => useContext<any>(AppContext);

export { AppContext as default, SubpaseProvider, useSubpaseContext };
