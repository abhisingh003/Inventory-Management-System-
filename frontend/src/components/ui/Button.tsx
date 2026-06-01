import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export default function Button({ children, variant = "primary", loading, className = "", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={`button-primary ${variant === "secondary" ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : ""} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </motion.button>
  );
}
