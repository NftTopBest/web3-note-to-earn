import React from 'react';
import { createRoot } from 'react-dom/client';
import WalletProvider from './provider/WalletProvider';
import App from './App';

createRoot(document.getElementById('popup-page-root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>,
);
