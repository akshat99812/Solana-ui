"use client";

import * as React from "react";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { useTokenData } from "@/registry/new-york/hooks/useToken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { Button } from "@/components/ui/button";

interface TokenCardProps {
  address :string
}

export function TokenCard({ address }: TokenCardProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  
  const { tokenData,loading,error } = useTokenData(address);
  
  console.log("token data is "+ tokenData);
  
  const token = tokenData;

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(address);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!token) {
    return (
      <Card className="group relative w-full max-w-md overflow-hidden border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_70px_-15px_rgba(255,255,255,0.3)]">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Glass effect overlay */}
        <div className="absolute inset-0 rounded-lg border border-white/20" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Token Information
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex h-32 items-center justify-center">
            <p className="text-center text-gray-400">No token selected.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative w-full max-w-md overflow-hidden border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_70px_-15px_rgba(255,255,255,0.3)] hover:scale-[1.02]">
      {/* Animated gradient background */}
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Glass effect border */}
      <div className="absolute inset-0 rounded-lg border border-white/20" />
      
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent" />

      <CardHeader className="relative z-10 border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Avatar glow effect */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-lg transition-all duration-300 group-hover:opacity-60" />
            <Avatar className="relative h-16 w-16 ring-2 ring-white/20 shadow-xl transition-all duration-300 group-hover:ring-white/40 group-hover:scale-110">
              <AvatarImage src={token.logoURI} alt={token.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg">
                
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 tracking-tight">
              {token.name}
            </CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-gray-200 backdrop-blur-sm">
                {token.symbol}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-6">
        <div className="space-y-5">
          {/* Address Section */}
          <div className="group/item rounded-lg bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
                  Contract Address
                </span>
                <span className="block break-all font-mono text-sm text-white/90">
                  {address}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                  onClick={handleCopy}
                  title="Copy address"
                >
                  {hasCopied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                  onClick={() => window.open(`https://solscan.io/token/${token.address}`, '_blank')}
                  title="View on Solscan"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Decimals */}
            <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/20">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
                Decimals
              </span>
              <span className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                {token.decimals}
              </span>
            </div>

            {/* Tags Count */}
            <div className="rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/20">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
                Current Price
              </span>
              <span className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                {token.price}
              </span>
            </div>
          </div>

          {/* Tags Display */}
          {token.tags && token.tags.length > 0 && (
            <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
              <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-gray-400">
                Token Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {token.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-105 hover:border-white/20"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Card>
  );
}