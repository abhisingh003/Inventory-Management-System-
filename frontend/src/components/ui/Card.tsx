import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="glass-card p-6 backdrop-blur-xl">
      {(title || description) && (
        <div className="mb-4 space-y-1">
          {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
