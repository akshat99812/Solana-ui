"use client";

import React ,{ useMemo } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { ModeToggle } from "@/components/ui/dark";

// Import some commonly used wallet adapters
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';

export default function Provider({children}) {
  const network = WalletAdapterNetwork.Mainnet; 
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      // Recommended: Wallets that support the Wallet Standard
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      
      // Other popular wallets
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    // Dependency array includes 'network' for wallets that might need it
    [network] 
  );
  
  return (
    <div>
      <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
      
    </div>
  )
}