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
import { useEffect, useState } from "react";

const projectId = "31299aa6a25a6b4fec5d2af2ed4a91bd";

const config = getDefaultConfig({
  appName: "Based Oracle",
  projectId,
  chains: [base],
  ssr: true,
});

export function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [isFarcaster, setIsFarcaster] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    const insideIframe = window.self !== window.top;
    const farcaster =
      ua.includes("farcaster") ||
      ua.includes("warpcast") ||
      insideIframe;

    setIsFarcaster(farcaster);
  }, []);

  if (isFarcaster) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

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