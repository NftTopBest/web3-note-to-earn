import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import './bla.scss';
import WalletProvider from './provider/WalletProvider';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

createRoot(document.getElementById('content-script-root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <MantineProvider
        theme={{
          colorScheme: 'dark',
          colors: {
            brand: [
              '#EAE5FF',
              '#C3B8FF',
              '#9D8AFF',
              '#775CFF',
              '#866ffa',
              '#2A00FF',
              '#2200CC',
              '#190099',
              '#000000',
              '#7B61FF',
            ],
          },
          primaryShade: 3,
          primaryColor: 'brand',
        }}
        withNormalizeCSS
      >
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </WalletProvider>
  </React.StrictMode>,
);
