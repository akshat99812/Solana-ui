"use client";

import React from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ChevronDown,
  Copy,
  LogOut,
  LoaderCircle,
  Wallet as WalletIcon, 
} from "lucide-react";

import { Button } from "@/registry/new-york/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";

export const WalletButton = () => {
  const {
    select,
    wallets,
    publicKey,
    disconnect,
    connecting,
    wallet,
  } = useWallet();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Memoize the public key to prevent unnecessary re-renders
  const base58 = React.useMemo(() => publicKey?.toBase58(), [publicKey]);

  // Handle copying the address
  const handleCopyAddress = React.useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
    }
  }, [base58]);

  // Render a dropdown menu if the wallet is connected
  if (base58 && wallet) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <div className="flex items-center space-x-2">
              <Image
                src={wallet.adapter.icon}
                alt={`${wallet.adapter.name} icon`}
                width={24}
                height={24}
              />
              <span className="font-mono">
                {base58.slice(0, 4)}...{base58.slice(-4)}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Address</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => disconnect()}
            className="text-red-500 focus:text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Render a dialog trigger to connect if the wallet is not connected
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={connecting}>
          {connecting ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <WalletIcon className="mr-2 h-4 w-4" />
          )}
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a wallet</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ul className="flex flex-col space-y-2">
            {wallets.filter((w) => w.readyState === 'Installed').map((walletItem) => (
              <li key={walletItem.adapter.name}>
                <Button
                  variant="secondary"
                  className="w-full justify-start h-12 text-md"
                  onClick={() => {
                    select(walletItem.adapter.name);
                    setIsDialogOpen(false);
                  }}
                  disabled={connecting}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={walletItem.adapter.icon}
                      alt={walletItem.adapter.name}
                      width={28}
                      height={28}
                    />
                    <span>{walletItem.adapter.name}</span>
                    {connecting &&
                      wallet?.adapter.name === walletItem.adapter.name && (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                      )}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};