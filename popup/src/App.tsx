import { FC } from 'react';
import { Blockquote, Button, Paper, Box } from '@mantine/core';
import { useWallet } from './provider/WalletProvider';
import './App.css';

const App: FC = () => {
  const { isAuthenticated, connectWallet, disconnectWallet } = useWallet();

  const clickToConnect = async () => {
    if (isAuthenticated) {
      disconnectWallet();
    } else {
      connectWallet();
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
        <Button variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}>
          Register
        </Button>
      </Box>
    </Paper>
  );
};

export default App;
