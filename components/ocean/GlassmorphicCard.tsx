
import React from "react";

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassmorphicCard = ({ children, ...props }: GlassmorphicCardProps) => {
  return (
    <div className="glassmorphic-card p-6 rounded-lg shadow-lg" {...props}>
      {children}
    </div>
  );
};
