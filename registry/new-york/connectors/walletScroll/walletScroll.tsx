"use client";

import React from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { Avatar } from "@/registry/new-york/connectors/avatar/avatar";
import {
  ChevronDown,
  Copy,
  LogOut,
  LoaderCircle,
  Wallet as WalletIcon,
} from "lucide-react";

import { Button } from "@/registry/new-york/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const WalletScrollButton = () => {
  const {
    select,
    wallets,
    publicKey,
    disconnect,
    connecting,
    wallet,
  } = useWallet();

  const base58 = React.useMemo(() => publicKey?.toBase58(), [publicKey]);
  

  if (base58 && wallet) {
    return (
      <div className="flex justify-center">
        <div className="mx-2">
          <Avatar address={base58}></Avatar>
        </div>
        <div className="mx-2 my-auto">
          <Button
            onClick={() => disconnect()}
            className="text-red-500 focus:text-red-500"
            variant="outline"
          >
            <LogOut className=" h-4 w-4" />
            {/*<span>Disconnect</span>*/}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={connecting}>
          {connecting ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <WalletIcon className="mr-2 h-4 w-4" />
          )}
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-60 w-56 overflow-y-auto">
        <DropdownMenuLabel>Select a wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {wallets.filter((w) => w.readyState === 'Installed').map((walletItem) => (
          <DropdownMenuItem
            key={walletItem.adapter.name}
            onClick={() => select(walletItem.adapter.name)}
            disabled={connecting}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <Image
                src={walletItem.adapter.icon}
                alt={walletItem.adapter.name}
                width={24}
                height={24}
                className="mr-2"
              />
              <span>{walletItem.adapter.name}</span>
            </div>
            {connecting && wallet?.adapter.name === walletItem.adapter.name && (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};