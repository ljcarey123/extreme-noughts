'use client';

import { motion } from 'framer-motion';

interface ModalOverlayProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export function ModalOverlay({ onClick, children }: ModalOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClick}
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative z-50">{children}</div>
    </motion.div>
  );
}
