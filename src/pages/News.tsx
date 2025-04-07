
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const News = () => {
  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
          <div className="relative z-10">
            <NavBar />
            <div className="container py-12">
              <h1 className="text-4xl font-bold text-white">Crypto News</h1>
              <p className="mt-4 text-gray-300">Latest news from the crypto and web3 world will appear here.</p>
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default News;
