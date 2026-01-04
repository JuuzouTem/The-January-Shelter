'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import InteractiveItem from './InteractiveItem';

const OwlAnim = () => {
  const [isHooting, setIsHooting] = useState(false);

  const hootSound = new Howl({
    src: ['/sounds/hoot.mp3'],
    volume: 0.4,
  });

  const handleHoot = () => {
    if (isHooting) return;
    setIsHooting(true);
    hootSound.play();
    setTimeout(() => setIsHooting(false), 2000);
  };

  return (
    <InteractiveItem onClick={handleHoot} label="Bekçi Baykuş" className="w-20 h-20 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        
        {isHooting && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 bg-white text-black text-xs px-2 py-1 rounded-tl-lg rounded-tr-lg rounded-br-lg font-bold z-50 whitespace-nowrap"
          >
            Hoot!
          </motion.div>
        )}

        {/* CSS İle Çizilmiş Baykuş (Animasyon için gerekli) */}
        <motion.div 
          className="w-12 h-16 bg-[#4a5568] rounded-full relative border-2 border-[#2d3748] shadow-lg"
          animate={isHooting ? { rotate: [0, -10, 10, 0] } : {}}
        >
          {/* Gözler */}
          <div className="absolute top-3 left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
             <motion.div className="w-2 h-2 bg-black rounded-full" animate={isHooting ? { height: [8, 1, 8] } : {}} />
          </div>
          <div className="absolute top-3 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
             <motion.div className="w-2 h-2 bg-black rounded-full" animate={isHooting ? { height: [8, 1, 8] } : {}} />
          </div>
          {/* Gaga */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-400 rotate-45" />
          {/* Kanatlar */}
          <div className="absolute top-8 -left-1 w-3 h-8 bg-[#2d3748] rounded-l-full" />
          <div className="absolute top-8 -right-1 w-3 h-8 bg-[#2d3748] rounded-r-full" />
        </motion.div>
      </div>
    </InteractiveItem>
  );
};

export default OwlAnim;