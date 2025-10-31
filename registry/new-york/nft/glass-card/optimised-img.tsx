// UniversalImage.tsx
import React from "react";

// Define props that work for both <img> and next/image
export interface UniversalImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean; // only used in Next.js
  style?: React.CSSProperties;
  fallbackSrc?: string; // fallback image source
  lazy?: boolean; // lazy loading (ignored in this simple implementation)
}

// Try to dynamically import next/image if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NextImage: any;
try {
  // This will only work in Next.js
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  NextImage = require("next/image").default;
} catch {
  NextImage = null;
}

export const UniversalImage: React.FC<UniversalImageProps> = (props) => {
  const { src, alt, width, height, priority, className, style, fallbackSrc, lazy, ...rest } = props;
  
  if (NextImage) {
    // Running in Next.js → use next/image
    // If width/height not provided, use fill mode or provide defaults
    if (!width || !height) {
      return (
        <div className={className} style={{ position: 'relative', ...style }}>
          <NextImage
            src={src}
            alt={alt}
            fill
            priority={priority}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
               if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
                 e.currentTarget.src = fallbackSrc;
               }
             }}
            {...rest}
          />
        </div>
      );
    }
    
    return (
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        style={style}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
           if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
             e.currentTarget.src = fallbackSrc;
           }
         }}
        {...rest}
      />
    );
  }

  // Running in plain React → fallback to <img>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={lazy ? "lazy" : "eager"}
      onError={(e) => {
        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
      }}
      {...rest}
    />
  );
};

// Export as OptimizedImage for backward compatibility
export const OptimizedImage = UniversalImage;