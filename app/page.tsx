"use client";
import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ocean/Navbar";
import { Footer } from "@/components/ocean/Footer";
import { GlassmorphicCard } from "@/components/ocean/GlassmorphicCard";
import { AnimatedText } from "@/components/ocean/AnimatedText";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);
  
  const router = useRouter();

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <main className="relative flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden">
            <Navbar />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <GlassmorphicCard>
                <div className="text-center">
                  <AnimatedText
                    text="Solana UI Ocean"
                    className="text-4xl md:text-6xl font-bold text-primary"
                  />
                  <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                    we are not YC backed
                  </p>
                  <div>
                    <button
                      className="bg-white px-12 text-black text-2xl py-2 rounded-2xl mt-12"
                      onClick={() => {
                        router.push('/components');
                      }}
                    >
                      Explore components
                    </button>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl"
                animate={{
                  x: [0, -100, 0],
                  y: [0, 100, 0],
                  scale: [1, 1.2, 1],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              />
            </div>
            <Footer />
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}