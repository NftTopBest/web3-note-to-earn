import { createContext, ReactNode, useContext, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

const SubpaseProvider = ({ children }: SubpaseProviderProps) => {
  const supabase = createClient(supabaseUrl, supabaseKey, options);

  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);

  const save = async (formData: any) => {
    setLoadingInitial(true);
    const { data, error } = await supabase.from('post').insert([formData]);

    setError(error?.message ?? '');
    setLoadingInitial(false);

    return error;
  };

  const getUserPost = async (account: string) => {
    // TODO 错误处理
    const { data, error } = await supabase
      .from('post')
      .select(SELECT_POSTS)
      .eq('author', account);

    return data;
  };

  const getAllPosts = async (account: string) => {
    // TODO 错误处理
    const { data, error } = await supabase
      .from('post')
      .select(SELECT_POSTS)
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useSubpaseContext = () => useContext<any>(AppContext);

export { AppContext as default, SubpaseProvider, useSubpaseContext };
