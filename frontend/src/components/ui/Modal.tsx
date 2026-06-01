import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card mx-auto w-full max-w-2xl p-6"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300 transition hover:bg-slate-800"
                onClick={onClose}
              >
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
