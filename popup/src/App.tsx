import { FC, useEffect, useState } from 'react';
import { Blockquote, Button, Paper, Box, Text, Title } from '@mantine/core';
import { useWallet } from './provider/WalletProvider';
import { useSubpaseContext } from './provider/SubpaseProvider';
import './App.css';

const App: FC = () => {
  const { isAuthenticated, connectWallet, disconnectWallet, account: walletAccount } = useWallet();
  const { initializeUser } = useSubpaseContext();
  const [account, setAccount] = useState<null | string>(null);

  useEffect(() => {
    if (isAuthenticated && walletAccount) {
      initializeUser(walletAccount);
      setAccount(walletAccount);
    }
  }, [isAuthenticated, walletAccount]);

  const clickToConnect = async () => {
    if (isAuthenticated) {
      disconnectWallet();
    } else {
      const { account } = await connectWallet();
      if (account) {
        initializeUser(account);
      }
    }
  };

  return (
    <Box
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingBottom: '36px',
        backgroundColor: '#1a1b1e',
      }}
    >
      <Blockquote cite="– Web3 S.H.E.I.L.D">Welcom to branch new web3 social</Blockquote>
      <Box sx={{ display: 'flex', width: '50%', alignItems: 'center', flexDirection: "column" }}>
        <Title order={4} sx={{ color: "#fff", marginBottom: 16 }}>
          Your account
        </Title>
        {isAuthenticated && <Text size="xs" color="#fff">
          {account}
        </Text>}
      </Box>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '36px' }}>
        <Button onClick={clickToConnect}>{isAuthenticated ? 'Disconnect' : 'Connect'}</Button>
      </Box>
    </Box>
  );
};

export default App;
