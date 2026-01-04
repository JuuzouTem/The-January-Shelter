'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import InteractiveItem from './InteractiveItem';

const OwlAnim = () => {
  const [isHooting, setIsHooting] = useState(false);

  // Ses dosyasının yolu
  const hootSound = new Howl({
    src: ['/sounds/hoot.mp3'],
    volume: 0.4,
  });

  const handleHoot = () => {
    if (isHooting) return;
    setIsHooting(true);
    hootSound.play();
    
    // 2 saniye sonra yazıyı kaldır
    setTimeout(() => setIsHooting(false), 2000);
  };

  return (
    <InteractiveItem onClick={handleHoot} label="Bekçi Baykuş" className="w-full h-full">
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Konuşma Balonu Animasyonu */}
        <AnimatePresence>
          {isHooting && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.5, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              
              // ÖNEMLİ KISIM:
              // -top-[70px]: Baykuşun kafasından 70 piksel yukarı iter.
              // left-1/2 ve -translate-x-1/2 (x: "-50%" içinde): Tam ortalar.
              className="absolute -top-[30px] left-1/2 bg-white text-black text-sm px-4 py-2 rounded-2xl font-bold z-[60] whitespace-nowrap shadow-xl border-2 border-[#4a3b32]"
            >
              Hoot!
              
              {/* Balonun altındaki minik ok (üçgen) */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-[#4a3b32] rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Baykuş Görseli */}
        <motion.img 
          src="/images/items/owl.png" 
          alt="Baykuş"
          className="w-full h-full object-contain drop-shadow-xl select-none pointer-events-none"
          animate={isHooting ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : { y: [0, -5, 0] }}
          transition={isHooting ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }} 
        />
      </div>
    </InteractiveItem>
  );
};

export default OwlAnim;