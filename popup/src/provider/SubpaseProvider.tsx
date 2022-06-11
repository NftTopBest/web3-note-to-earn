import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
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

const SubpaseContext = createContext({});

type SubpaseProviderProps = { children: ReactNode | JSX.Element };

const SubpaseProvider = ({ children }: SubpaseProviderProps) => {
  const supabase = createClient(supabaseUrl, supabaseKey, options);

  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const connection = useRef<any>(null);

  useEffect(() => {
    // 获取当前 tab ID
    (async () => {
      function getCurrentTabId() {
        return new Promise((resolve, reject) => {
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs.length ? tabs[0].id : null);
          });
        });
      }

      const tabId = (await getCurrentTabId()) as number;

      console.log("tabId ", tabId);
      
      connection.current = chrome.tabs.connect(tabId, { name: 'popup' });
      console.log("connection.current ", connection.current);
    })();
  }, []);

  const initializeUser = async (address: string) => {
    setLoadingInitial(true);

    const { data, error } = await supabase.from('user').select('id, email, address').eq('address', address);

    if (data?.length === 0) {
      const { data, error } = await supabase.from('user').insert([{ address }]);

      console.log('user data ', data);
      setError(error ? 'Sign up fail' : '');
      setUsername(data ? data[0].address : '');

      if (connection.current && data && data.length > 0) {
        connection.current.postMessage(data[0]);
      }
    } else {
      if (connection.current && data && data.length > 0) {
        connection.current.postMessage(data[0]);
      }
    }

    setLoadingInitial(false);
  };

  return (
    <SubpaseContext.Provider
      value={{
        supabase,
        auth: supabase.auth,
        messages,
        loadingInitial,
        initializeUser,
        error,
        username,
        setUsername,
      }}
    >
      {children}
    </SubpaseContext.Provider>
  );
};

const useSubpaseContext = () => useContext<any>(SubpaseContext);

export { SubpaseContext as default, SubpaseProvider, useSubpaseContext };
