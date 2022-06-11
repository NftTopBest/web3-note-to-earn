import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import './bla.scss';
import WalletProvider from './provider/WalletProvider';
import { SubpaseProvider } from './provider/SubpaseProvider';

createRoot(document.getElementById('content-script-root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <SubpaseProvider>
        <App />
      </SubpaseProvider>
    </WalletProvider>
  </React.StrictMode>,
);
