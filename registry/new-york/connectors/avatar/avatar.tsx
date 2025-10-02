"use client";

import React,{ useMemo} from "react";
import { minidenticon } from "minidenticons";
import { cn } from "@/lib/utils"; 

interface SolanaIdenticonProps {
  address: string;
  saturation?: number;
  lightness?: number;
  className?: string;
}

export const Avatar = ({
  address,
  saturation = 95,
  lightness = 45,
  className,
  ...props
}: SolanaIdenticonProps) => {
  if (!address) {
    return null;
  }
  const svgString = useMemo(
    () => minidenticon(address, saturation, lightness),
    [address, saturation, lightness]
  );

  return (
    <div
      className={cn("h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      dangerouslySetInnerHTML={{ __html: svgString }}
      {...props}
    />
  );
};