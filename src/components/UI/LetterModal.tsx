'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
// Mektup içeriğini ayrı bir dosyadan çekelim
import { letterContent } from '@/data/letterContent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LetterModal = ({ isOpen, onClose }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-2xl bg-[#fdfbf7] text-[#1a1a1a] rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Kağıt Dokusu ve Çizgiler */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px)',
                backgroundSize: '100% 28px'
              }}
            />

            {/* İçerik */}
            <div className="relative z-10 p-8 md:p-12 max-h-[80vh] overflow-y-auto scrollbar-thin">
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-serif text-accent mb-6">Mutlu Yıllar...</h2>
              
              <div className="prose prose-lg font-serif leading-relaxed text-gray-800 whitespace-pre-wrap">
                {letterContent}
              </div>

              <div className="mt-12 text-right font-handwriting text-gray-500">
                — Ocak Sığınağı'ndan sevgilerle.
              </div>
            </div>

            {/* Dekoratif Süsler */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent/20 via-accent/50 to-accent/20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LetterModal;