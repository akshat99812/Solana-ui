"use client";

import * as React from "react";
import { Star, Trash2, ArrowUpDown } from "lucide-react";

// Types
interface Token {
  address: string;
  name: string;
  symbol: string;
  logoURI?: string;
  decimals?: number;
  chainId?: number;
}

interface FavoriteTokensProps {
  onSelectToken?: (token: Token) => void;
  className?: string;
}

type SortOption = "name" | "symbol" | "recent";

// Main Component
export function FavoriteTokens({ onSelectToken, className }: FavoriteTokensProps) {
  const [favorites, setFavorites] = React.useState<Token[]>([]);
  const [sortBy, setSortBy] = React.useState<SortOption>("recent");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Load favorites from window storage on mount
  React.useEffect(() => {
    const stored = (window as any).favoriteTokens || [];
    setFavorites(stored);

    // Listen for storage events to sync across components
    const handleStorageChange = () => {
      const updated = (window as any).favoriteTokens || [];
      setFavorites(updated);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to window storage whenever favorites change
  React.useEffect(() => {
    (window as any).favoriteTokens = favorites;
  }, [favorites]);

  const removeFavorite = React.useCallback((address: string) => {
    setFavorites((prev) => prev.filter((token) => token.address !== address));
    window.dispatchEvent(new Event('storage'));
  }, []);

  const sortedFavorites = React.useMemo(() => {
    const sorted = [...favorites];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "symbol":
        return sorted.sort((a, b) => a.symbol.localeCompare(b.symbol));
      case "recent":
      default:
        return sorted.reverse();
    }
  }, [favorites, sortBy]);

  const handleTokenClick = React.useCallback((token: Token) => {
    onSelectToken?.(token);
  }, [onSelectToken]);

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`group relative overflow-hidden rounded-lg border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl shadow-2xl ${className}`}>
      {/* Animated gradient background */}
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40" />
      
      {/* Glass effect border */}
      <div className="absolute inset-0 rounded-lg border border-white/20" />

      {/* Header */}
      <div className="relative z-10 flex flex-row items-center justify-between border-b border-white/10 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          Favorite Tokens
        </h3>
        
        {/* Simple Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-8 px-3 text-sm text-gray-400 hover:bg-white/10 hover:text-white rounded-md transition-colors flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>
          
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-32 rounded-md bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleSortChange("recent")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors"
                  >
                    Recent
                  </button>
                  <button
                    onClick={() => handleSortChange("name")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors"
                  >
                    Name
                  </button>
                  <button
                    onClick={() => handleSortChange("symbol")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors"
                  >
                    Symbol
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-0">
        {sortedFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <Star className="h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No favorite tokens yet</p>
            <p className="text-gray-500 text-xs mt-1">Star tokens to add them here</p>
          </div>
        ) : (
          <div className="h-[400px] overflow-auto">
            <div className="p-4 space-y-2">
              {sortedFavorites.map((token, index) => (
                <div
                  key={token.address}
                  className="group/item flex items-center justify-between rounded-lg bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div
                    className="flex flex-1 items-center gap-3 cursor-pointer"
                    onClick={() => handleTokenClick(token)}
                  >
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 blur transition-all duration-300 group-hover/item:opacity-30" />
                      <div className="relative h-10 w-10 rounded-full ring-2 ring-white/10 transition-all duration-300 group-hover/item:ring-white/30 overflow-hidden">
                        {token.logoURI ? (
                          <img src={token.logoURI} alt={token.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-500 text-white text-xs font-bold">
                            {token.symbol.slice(0, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{token.name}</p>
                      <p className="text-xs text-gray-400">{token.symbol}</p>
                    </div>
                  </div>
                  <button
                    className="h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 opacity-0 group-hover/item:opacity-100 rounded-md"
                    onClick={() => removeFavorite(token.address)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for managing favorites
export const addToFavorites = (token: Token) => {
  const current = (window as any).favoriteTokens || [];
  const exists = current.find((t: Token) => t.address === token.address);
  if (!exists) {
    (window as any).favoriteTokens = [...current, token];
    window.dispatchEvent(new Event('storage'));
  }
};

export const removeFromFavorites = (address: string) => {
  const current = (window as any).favoriteTokens || [];
  (window as any).favoriteTokens = current.filter((t: Token) => t.address !== address);
  window.dispatchEvent(new Event('storage'));
};

export const isFavorite = (address: string): boolean => {
  const current = (window as any).favoriteTokens || [];
  return current.some((t: Token) => t.address === address);
};

// Export Token type for use in other components
export type { Token };