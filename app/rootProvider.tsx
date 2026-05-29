"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { useState, useMemo } from "react";

const projectId =
  "31299aa6a25a6b4fec5d2af2ed4a91bd";

export function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () => new QueryClient()
  );

  const config = useMemo(
    () =>
      getDefaultConfig({
        appName: "Based Oracle",
        projectId,
        chains: [base],

        // Base App beyaz ekran için kalsın
        ssr: true,

        // MetaMask + Rabby + Coinbase
        multiInjectedProviderDiscovery: true,
      }),
    []
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider
        client={queryClient}
      >
        <RainbowKitProvider
          theme={darkTheme()}
          modalSize="wide"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}