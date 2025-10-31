
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md" {...props}>
      {children}
    </div>
  );
};
