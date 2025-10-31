import { useState, useEffect } from 'react';

interface TokenData {
  mintAddress: string;
  name: string;
  symbol: string;
  logoURI: string;
  decimals: number;
}

interface UseTokenDataReturn {
  tokenData: TokenData | null;
  loading: boolean;
  error: string | null;
}

export const useTokenData = (address: string | null): UseTokenDataReturn => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setTokenData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchTokenData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Example using Jupiter Token List API
        const response = await fetch(
          `https://token.jup.ag/strict/${address}`
        );

        if (!response.ok) {
          throw new Error('Token not found');
        }

        const data = await response.json();

        const token: TokenData = {
          mintAddress: data.address,
          name: data.name,
          symbol: data.symbol,
          logoURI: data.logoURI || '',
          decimals: data.decimals,
        };

        setTokenData(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch token data');
        setTokenData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [address]);

  return { tokenData, loading, error };
};