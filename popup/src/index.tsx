import React from 'react';
import { createRoot } from 'react-dom/client';
import WalletProvider from './provider/WalletProvider';
import App from './App';
import { SubpaseProvider } from './provider/SubpaseProvider';

createRoot(document.getElementById('popup-page-root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <SubpaseProvider>
        <App />
      </SubpaseProvider>
    </WalletProvider>
  </React.StrictMode>,
);
