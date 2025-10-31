
import React from "react";
import { motion,HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
      {...props}
    >
      {children}
    </motion.button>
  );
};
