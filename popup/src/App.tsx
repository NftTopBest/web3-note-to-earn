import { FC } from 'react';
import { Blockquote, Button, Paper, Box, Text } from '@mantine/core';
import { useWallet } from './provider/WalletProvider';
import './App.css';
import { useSubpaseContext } from './provider/SubpaseProvider';

const App: FC = () => {
  const { isAuthenticated, connectWallet, disconnectWallet, account } = useWallet();
  const { initializeUser } = useSubpaseContext();

  const clickToConnect = async () => {
    console.log('isAuthenticated ', isAuthenticated);
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
    <Paper
      p="md"
      shadow="none"
      style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', paddingBottom: '36px' }}
    >
      <Blockquote cite="– Web3 S.H.E.I.L.D">Welcom to branch new web3 social</Blockquote>
      <Box sx={{ display: 'flex', width: '50%', justifyContent: 'space-between', marginTop: '36px' }}>
        <Button variant="gradient" onClick={clickToConnect} gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
          Connect
        </Button>
      </Box>
      <Box sx={{ display: 'flex', width: '50%', justifyContent: 'center', marginTop: '36px' }}>
        <Text size="sm">{account}</Text>
      </Box>
    </Paper>
  );
};

export default App;
