
import React from "react";
import { ModeToggle } from "@/components/ui/dark";
import { WalletScrollButton } from "@/registry/new-york/connectors/walletScroll/walletScroll";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50">
      <h1 className="text-2xl font-bold text-primary">Solana UI Ocean</h1>
      <div className="flex gap-4">
        <ModeToggle />
        <WalletScrollButton />
      </div>
    </nav>
  );
};
