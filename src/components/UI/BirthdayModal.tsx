'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BirthdayModal: React.FC<BirthdayModalProps> = ({ isOpen, onClose }) => {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setIsOpened(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen overflow-hidden"
      >
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Quicksand:wght@300..700&display=swap');
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-quicksand { font-family: 'Quicksand', sans-serif; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* --- ARKA PLAN --- */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ backgroundColor: '#fce4ec00' }}
          animate={{ backgroundColor: isOpened ? '##fce4ec00' : '#fce4ec00' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          onClick={() => { if(isOpened) onClose(); }}
        />

        {/* --- TALİMAT YAZISI --- */}
        {!isOpened && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-2xl text-[#c51c1c] font-bold font-quicksand pointer-events-none tracking-widest uppercase"
          >
            Kalbe Tıkla!
          </motion.p>
        )}

        {/* --- MEKTUP KARTI --- */}
        <motion.div
          className="absolute bg-[#eee] shadow-[0_10px_20px_rgba(0,0,0,0.19),0_6px_6px_rgba(0,0,0,0.23)] rounded-md overflow-hidden z-10 font-quicksand text-justify leading-relaxed flex flex-col"
          style={{ 
            top: '50%', 
            left: '50%', 
            x: '-50%', 
            y: '-50%',
            width: 'min(80%, 550px)'
          }}
          initial={{ height: 0, padding: 0, opacity: 0 }}
          animate={isOpened 
            ? { height: '75%', padding: '25px', opacity: 1 } 
            : { height: 0, padding: 0, opacity: 0 }
          }
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div className="w-full h-full overflow-y-auto no-scrollbar relative">
            <button 
                onClick={onClose}
                className="absolute top-[0] right-0 text-gray-400 hover:text-red-600 transition-colors"
            >
                <X size={10} />
            </button>

            <h1 className="font-cinzel text-3xl md:text-[40px] text-[#c71212] mb-6 font-normal tracking-wider">
                İyi ki Doğdun!
            </h1>
            
            <div className="text-[#c51c1c] text-base md:text-[17px] space-y-4">
               <p>
                  &emsp; Soon.
               </p>
               <p>
                  &emsp; Soon.
               </p>
               <p>
                  &emsp; Soon.
               </p>
            </div>

            <br />
            
            <div className="font-cinzel text-sm text-[#c52222] mt-4 text-left">
                <p className="font-bold m-0">Sevgilerle,</p>
            </div>
          </div>
        </motion.div>

        {/* --- KALP İKONU (GÜNCELLENDİ: CANLI KIRMIZI) --- */}
        <motion.div
            className="absolute z-20 cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                if (!isOpened) setIsOpened(true);
            }}
            initial={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
            animate={isOpened 
                ? { top: '88%', left: '50%', x: '-50%', y: '0%' }
                : { top: '50%', left: '50%', x: '-50%', y: '-50%' }
            }
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
            <motion.div
                animate={{ scale: [1, 1.15, 1, 0.9, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Değişiklik Burası: text-red-600 ve fill-red-600 */}
                <Heart 
                    className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-[#c71212] fill-[#c51c1c] drop-shadow-lg" 
                    strokeWidth={1}
                />
            </motion.div>
        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
};

export default BirthdayModal;