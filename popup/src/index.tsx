import React from 'react';
import { createRoot } from 'react-dom/client';
import WalletProvider from './provider/WalletProvider';
import App from './App';
import { SubpaseProvider } from './provider/SubpaseProvider';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('popup-page-root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <SubpaseProvider>
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
                '#110066',
                '#7B61FF',
              ],
            },
            primaryShade: 3,
            primaryColor: 'brand',
          }}
          withNormalizeCSS
        >
          <App />
        </MantineProvider>
      </SubpaseProvider>
    </WalletProvider>
  </React.StrictMode>,
);
