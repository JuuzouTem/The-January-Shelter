'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InteractiveItem from './InteractiveItem';

const TeaCup = () => {
  const [sips, setSips] = useState(5);

  const handleDrink = () => {
    if (sips > 0) {
      setSips(sips - 1);
    }
  };

  return (
    <InteractiveItem onClick={handleDrink} label={sips > 0 ? "Sıcak Çay" : "Bitti..."} className="w-16 h-16 md:w-20 md:h-20">
      <div className="relative flex items-end justify-center w-full h-full">
        {/* Buhar Efekti */}
        {sips > 0 && (
          <motion.div
            animate={{ y: [-5, -15, -5], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 text-white/50 text-xl font-bold"
          >
            ~
          </motion.div>
        )}
        
        {/* Çay Görseli */}
        <img 
          src="/images/items/tea.png" 
          alt="Çay" 
          className="w-full h-full object-contain drop-shadow-lg"
          style={{ opacity: 0.3 + (sips / 7) }} // Azaldıkça silikleşir
        />
      </div>
    </InteractiveItem>
  );
};

export default TeaCup;