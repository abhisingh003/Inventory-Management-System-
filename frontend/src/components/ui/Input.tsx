import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block text-sm text-slate-300">
      {label && <span className="mb-2 block font-medium">{label}</span>}
      <input className={`input-field ${className}`} {...props} />
    </label>
  );
}
