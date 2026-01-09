'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InteractiveItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  label?: string;
}

const InteractiveItem = ({ children, onClick, className, label }: InteractiveItemProps) => {
  return (
    <motion.div
      className={`relative cursor-pointer group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>

      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50"
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InteractiveItem;