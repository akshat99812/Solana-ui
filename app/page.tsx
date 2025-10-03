"use client";
//import { WalletButton } from "@/registry/new-york/connectors/walletButton/walletButton";

import React ,{ useMemo } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { ModeToggle } from "@/components/ui/dark";
import { WalletScrollButton } from "@/registry/new-york/connectors/walletScroll/walletScroll";
import { TokenSender } from "@/registry/new-york/transactionKit/status/egSender";

export default function Home() {

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [], []);
  

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <ModeToggle></ModeToggle>
      <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletScrollButton></WalletScrollButton>
          <TokenSender></TokenSender>

          
          
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
       
    </div>
  )
}
