import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import './bla.scss';
import WalletProvider from './provider/WalletProvider';

createRoot(document.getElementById('content-script-root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>,
);
