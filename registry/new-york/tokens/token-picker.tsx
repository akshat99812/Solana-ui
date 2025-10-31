import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface TokenData {
  mintAddress: string;
  name: string;
  symbol: string;
  logoURI: string;
  decimals: number;
}

const PRESET_TOKENS: TokenData[] = [
  {
    mintAddress: 'So11111111111111111111111111111111111111112',
    name: 'Wrapped SOL',
    symbol: 'SOL',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    decimals: 9
  },
  {
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    decimals: 6
  },
  {
    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    name: 'USDT',
    symbol: 'USDT',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
    decimals: 6
  },
  {
    mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    name: 'Marinade staked SOL',
    symbol: 'mSOL',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
    decimals: 9
  }
];

export default function TokenPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(PRESET_TOKENS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTokens = async () => {
      setLoading(true);
      try {
        // Using Helix API endpoint
        const response = await fetch(
          `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mintAccounts: [searchQuery.trim()]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const token = data[0];
            setSearchResults([{
              mintAddress: token.account,
              name: token.onChainMetadata?.metadata?.data?.name || 'Unknown',
              symbol: token.onChainMetadata?.metadata?.data?.symbol || '???',
              logoURI: token.onChainMetadata?.metadata?.data?.uri || '',
              decimals: token.decimals || 9
            }]);
          } else {
            setSearchResults([]);
          }
        } else {
          // Fallback to Jupiter API for search
          const jupResponse = await fetch(
            `https://token.jup.ag/strict/${searchQuery.trim()}`
          );
          if (jupResponse.ok) {
            const token = await jupResponse.json();
            setSearchResults([{
              mintAddress: token.address,
              name: token.name,
              symbol: token.symbol,
              logoURI: token.logoURI || '',
              decimals: token.decimals
            }]);
          } else {
            setSearchResults([]);
          }
        }
      } catch (error) {
        console.error('Error searching tokens:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchTokens, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery,selectedToken]);

  const handleSelectToken = (token: TokenData) => {
    setSelectedToken(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  const displayedTokens = searchQuery.trim() 
    ? searchResults 
    : PRESET_TOKENS;

  return (
      <div className="w-full max-w-md min-w-[350px]">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Select Token
          </h2>
          
          <div className="relative" ref={dropdownRef}>
            {/* Selected Token Display */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-200"
            >
              {selectedToken ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedToken.logoURI}
                    alt={selectedToken.symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/32';
                    }}
                  />
                  <div className="text-left">
                    <div className="text-white font-semibold">{selectedToken.symbol}</div>
                    <div className="text-white/60 text-sm">{selectedToken.name}</div>
                  </div>
                </div>
              ) : (
                <span className="text-white/60">Select a token</span>
              )}
              <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-10">
                {/* Search Input */}
                <div className="p-3 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search name or paste address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Token List */}
                <div className="max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center text-white/60">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                      <p className="mt-2">Searching...</p>
                    </div>
                  ) : displayedTokens.length > 0 ? (
                    <>
                      {!searchQuery && (
                        <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                          Popular Tokens
                        </div>
                      )}
                      {displayedTokens.map((token) => (
                        <button
                          key={token.mintAddress}
                          onClick={() => handleSelectToken(token)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
                        >
                          <img
                            src={token.logoURI}
                            alt={token.symbol}
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/40';
                            }}
                          />
                          <div className="flex-1 text-left">
                            <div className="text-white font-semibold">{token.symbol}</div>
                            <div className="text-white/60 text-sm">{token.name}</div>
                          </div>
                          {selectedToken?.mintAddress === token.mintAddress && (
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="p-8 text-center text-white/60">
                      No tokens found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selected Token Info */}
          {selectedToken && (
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Selected Token Details</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Address:</span>
                  <span className="text-white font-mono text-xs">
                    {selectedToken.mintAddress.slice(0, 6)}...{selectedToken.mintAddress.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Decimals:</span>
                  <span className="text-white">{selectedToken.decimals}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}