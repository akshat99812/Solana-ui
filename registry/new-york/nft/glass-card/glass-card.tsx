"use client";

import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  cn,
  shortAddress,
  fetchNFTMetadata,
  type NFTMetadata,
} from "@/registry/new-york/nft/glass-card/utils";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Image as ImageIcon, Loader2, Copy, Check, Info, X } from "lucide-react";
import { APIErrorBoundary } from "@/registry/new-york/nft/glass-card/error-boundry";
import { OptimizedImage } from "@/registry/new-york/nft/glass-card/optimised-img";

export interface NFTCardProps {
  /** The mint address of the NFT */
  mintAddress: string | PublicKey;
  /** Custom CSS classes */
  className?: string;
  /** Show NFT attributes */
  showAttributes?: boolean;
  /** Show collection info */
  showCollection?: boolean;
  /** Card variant */
  variant?: "default" | "compact" | "detailed";
  /** Loading state */
  isLoading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom metadata (bypasses fetching) */
  metadata?: NFTMetadata;
}

const NFTCardContent = React.forwardRef<HTMLDivElement, NFTCardProps>(
  (
    {
      mintAddress,
      className,
      showAttributes = false,
      showCollection = true,
      variant = "default",
      isLoading: externalLoading = false,
      onClick,
      metadata: customMetadata,
      ...props
    },
    ref,
  ) => {
    const mintStr = React.useMemo(() => {
      return typeof mintAddress === "string"
        ? mintAddress
        : mintAddress.toBase58();
    }, [mintAddress]);

    const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
    const [queryLoading, setQueryLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [copied, setCopied] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
      if (!customMetadata && mintStr) {
        setQueryLoading(true);
        setError(null);

        fetchNFTMetadata(mintStr)
          .then((data) => {
            setMetadata(data);
            setQueryLoading(false);
          })
          .catch((err) => {
            setError(err);
            setQueryLoading(false);
            throw err;
          });
      }
    }, [mintStr, customMetadata]);

    const finalMetadata = customMetadata || metadata;
    const isLoading = externalLoading || queryLoading;

    const handleCopyAddress = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(mintStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    };

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

    const cardVariants = {
      default: "w-[320px] h-[440px]",
      compact: "w-[280px] h-[380px]",
      detailed: "w-[360px] h-[500px]",
    };

    const imageVariants = {
      default: "h-56",
      compact: "h-44",
      detailed: "h-64",
    };

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl shadow-2xl",
            cardVariants[variant],
            className,
          )}
          {...props}
        >
          <div className="p-5 h-full flex flex-col">
            <div
              className={cn(
                "flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-xl shadow-inner backdrop-blur-sm mb-4",
                imageVariants[variant],
              )}
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary/80" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="h-5 bg-gradient-to-r from-white/20 to-white/5 rounded-lg animate-pulse backdrop-blur-sm" />
              <div className="h-4 bg-gradient-to-r from-white/15 to-white/5 rounded-lg w-2/3 animate-pulse backdrop-blur-sm" />
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      throw error;
    }

    if (!finalMetadata) {
      return (
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl shadow-2xl",
            cardVariants[variant],
            className,
          )}
          {...props}
        >
          <div className="p-5 h-full flex flex-col">
            <div
              className={cn(
                "flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-xl shadow-inner backdrop-blur-sm mb-4",
                imageVariants[variant],
              )}
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="font-semibold text-base text-muted-foreground">No NFT data</h3>
              <p className="text-sm text-muted-foreground/80 font-mono">
                {shortAddress(mintStr)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative perspective-1000",
          cardVariants[variant],
          className,
        )}
        style={{ perspective: "1000px" }}
        {...props}
      >
        <motion.div
          className="relative w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of Card */}
          <motion.div
            className={cn(
              "absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl shadow-2xl transition-all duration-300",
              onClick && "cursor-pointer hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] hover:border-white/20"
            )}
            style={{ backfaceVisibility: "hidden" }}
            onClick={onClick || handleFlip}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="p-5 h-full flex flex-col">
              {/* NFT Image */}
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 shadow-lg backdrop-blur-sm mb-4",
                  imageVariants[variant],
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10" />
                {finalMetadata.image ? (
                  <OptimizedImage
                    src={finalMetadata.image}
                    alt={finalMetadata.name || shortAddress(mintStr)}
                    className="h-full w-full object-cover transition-all duration-500 hover:scale-110"
                    fallbackSrc="https://imgs.search.brave.com/Mazk_XWzCti55-_c5UhniPwi1jDasPYhd1j2WYM-5ZI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/NWpzNDI0djdhYzg4/MS5qcGc_d2lkdGg9/OTYwJmNyb3A9c21h/cnQmYXV0bz13ZWJw/JnM9ZTBjMWI2Yzgw/ZjY4MzczMDMxNGIw/MjQ1M2JmMDA0NzBl/YjhkZTMzYg"
                    lazy={true}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
                  </div>
                )}

                <div className="absolute top-3 right-3 z-20 flex gap-2">
                  {/* Info Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip();
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 shadow-lg border border-white/20"
                    title="View Details"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                  
                  {/* External Link Button */}
                  {finalMetadata.external_url && (
                    <a
                      href={finalMetadata.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 shadow-lg border border-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* NFT Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className={cn(
                    "font-bold leading-tight text-white line-clamp-2",
                    variant === "compact" ? "text-base" : "text-lg",
                  )}>
                    {finalMetadata.name || shortAddress(mintStr)}
                  </h3>

                  {showCollection && finalMetadata.collection?.name && (
                    <p className="text-sm text-slate-400 font-medium">
                      {shortAddress(finalMetadata.collection.name)}
                    </p>
                  )}

                  {finalMetadata.description && variant !== "compact" && (
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {finalMetadata.description}
                    </p>
                  )}
                </div>

                {showAttributes && finalMetadata.attributes && finalMetadata.attributes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {finalMetadata.attributes.slice(0, 3).map((attr, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg bg-white/10 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-white/90 border border-white/10"
                      >
                        {attr.value}
                      </span>
                    ))}
                    {finalMetadata.attributes.length > 3 && (
                      <span className="inline-flex items-center rounded-lg bg-white/5 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-slate-400 border border-white/10">
                        +{finalMetadata.attributes.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Back of Card */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl shadow-2xl"
            style={{ backfaceVisibility: "hidden", rotateY: 180 }}
          >
            <div className="p-5 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">NFT Details</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                {/* Mint Address */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mint Address</p>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs font-mono text-white/90 flex-1 break-all">{mintStr}</p>
                    <button
                      onClick={handleCopyAddress}
                      className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-200"
                      title={copied ? "Copied!" : "Copy Address"}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Description */}
                {finalMetadata.description && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</p>
                    <p className="text-sm text-white/90 leading-relaxed p-3 bg-white/5 rounded-lg border border-white/10">
                      {finalMetadata.description}
                    </p>
                  </div>
                )}

                {/* Collection */}
                {finalMetadata.collection && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collection</p>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      {finalMetadata.collection.name && (
                        <p className="text-sm font-medium text-white/90 mb-1">{finalMetadata.collection.name}</p>
                      )}
                      {finalMetadata.collection.family && (
                        <p className="text-xs text-slate-400">Family: {finalMetadata.collection.family}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Attributes */}
                {finalMetadata.attributes && finalMetadata.attributes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attributes</p>
                    <div className="grid grid-cols-2 gap-2">
                      {finalMetadata.attributes.map((attr, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
                        >
                          <p className="text-xs text-slate-400 mb-1">{attr.trait_type}</p>
                          <p className="text-sm font-semibold text-white/90">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* External URL */}
                {finalMetadata.external_url && (
                  <a
                    href={finalMetadata.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 rounded-lg border border-white/20 text-white font-medium transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm">View External Link</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    );
  },
);

NFTCardContent.displayName = "NFTCardContent";

const NFTCard = React.forwardRef<HTMLDivElement, NFTCardProps>((props, ref) => {
  return (
    <APIErrorBoundary onRetry={() => window.location.reload()}>
      <NFTCardContent {...props} ref={ref} />
    </APIErrorBoundary>
  );
});

NFTCard.displayName = "NFTCard";

export { NFTCard };