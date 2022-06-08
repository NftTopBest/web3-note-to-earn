import { Blockquote, Button, Paper, Image, Box } from '@mantine/core';
import React, { FC } from 'react';
import "./App.css";

const App: FC = () => {
  return (
    <Paper
      shadow="none"
      p="md"
      style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', paddingBottom: "36px" }}
    >
      {/* <Image
        radius="md"
        src="/media.png"
        alt="Random unsplash image"
      /> */}
      <Blockquote cite="– Web3 S.H.E.I.L.D">Welcom to branch new web3 social</Blockquote>
      <Box sx={{ display: 'flex', width: '50%', justifyContent: 'space-between', marginTop: "36px" }}>
        <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
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
