'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote } from 'lucide-react';

interface BookQuotesProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
}

const BookQuotes = ({ isOpen, onClose, quote }: BookQuotesProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
            className="relative w-80 md:w-96 min-h-[300px] bg-[#fdfbf7] text-[#2c2c2c] p-8 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px)',
              backgroundSize: '20px 20px' // Defter çizgileri
            }}
          >
            {/* Bant Efekti */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/80 rotate-2 shadow-sm" />

            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black">
              <X size={24} />
            </button>

            <div className="flex flex-col items-center justify-center h-full gap-4 text-center mt-4">
              <Quote className="text-accent/50 rotate-180" size={32} />
              <p className="font-serif text-lg md:text-xl italic leading-relaxed">
                "{quote}"
              </p>
              <div className="w-16 h-1 bg-accent/20 rounded-full mt-4" />
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookQuotes;