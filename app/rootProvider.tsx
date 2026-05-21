"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";

import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  rabbyWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";

import { base } from "wagmi/chains";
import { useState } from "react";

const projectId = "31299aa6a25a6b4fec5d2af2ed4a91bd";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
wallets: [
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  rabbyWallet,
  walletConnectWallet,
],
    },
  ],
  {
    appName: "Based Oracle",
    projectId,
  }
);

const config = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () => new QueryClient()
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}