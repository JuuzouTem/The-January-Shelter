'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          
          initial={{ opacity: 0, scale: 0.8, y: 100, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          
          className="fixed top-1/2 left-1/2 z-[100] cursor-grab active:cursor-grabbing origin-center"
          
          style={{
            width: 'min(80vw, 320px)', 
            aspectRatio: '3/4',
            backgroundImage: "url('/images/paper-texture.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '5px 10px 20px rgba(0,0,0,0.4)',
            filter: 'sepia(30%) contrast(105%)',
            borderRadius: '4px'
          }}
        >
          {/* Kapat Butonu - Sağ Alt Köşe */}
          <button 
              onClick={onClose} 
              className="absolute text-[#4a3b32] hover:text-[#8B0000] transition-colors duration-300 z-50 opacity-70 hover:opacity-100 bg-white/30 rounded-full p-1"
              title="Kapat"
              style={{ 
                bottom: '20px', 
                right: '20px' 
              }}
          >
            <X size={24} strokeWidth={2} />
          </button>

          {/* İçerik Alanı */}
          <div className="absolute inset-0 flex flex-col">
            
            {/* 
               DÜZELTME BURADA YAPILDI:
               - justify-start: Metin yukarıdan başlar.
               - pt-20: Yukarıdan aşağıya boşluk (Tepeden inmesi için).
               - pl-16: Soldan içeriye boşluk (İstediğin 'sağa alma' işlemi).
               - pr-8: Sağdan boşluk.
               - text-left: Sola hizalı (ama padding sayesinde kenara yapışmaz).
            */}
            <div className="w-full h-full flex flex-col justify-start pt-20 pl-16 pr-8 text-left">
                <p 
                    className="text-xl leading-relaxed font-bold drop-shadow-sm select-none whitespace-pre-wrap"
                    style={{ 
                    fontFamily: '"Dancing Script", cursive',
                    color: '#2c1810',
                    mixBlendMode: 'multiply',
                    transform: 'rotate(-1deg)'
                    }}
                >
                    "{quote}"
                </p>

                {/* Süs Çizgisi - Metnin hemen altına hizalandı */}
                <div 
                    className="w-16 h-0.5 mt-6 rounded-full opacity-50"
                    style={{ backgroundColor: '#2c1810' }}
                />
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookQuotes;