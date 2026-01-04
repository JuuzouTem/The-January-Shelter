'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler'; // Hüp sesi için (Varsa)
import InteractiveItem from './InteractiveItem';

const TeaCup = () => {
  const [sips, setSips] = useState(5);
  const [isDrinking, setIsDrinking] = useState(false);

  const handleDrink = () => {
    if (sips > 0 && !isDrinking) {
      setIsDrinking(true);
      setSips(sips - 1);
      
      // İçme animasyonu bitince flag'i kaldır
      setTimeout(() => setIsDrinking(false), 1000);
    }
  };

  return (
    <InteractiveItem onClick={handleDrink} label={sips > 0 ? "Sıcak Çay" : "Bitti..."} className="w-full h-full">
      <div className="relative flex items-end justify-center w-full h-full">
        
        {/* Buhar Efekti (Çay varsa sürekli çıkar) */}
        {sips > 0 && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1">
             <motion.div 
               className="w-1 h-4 bg-white/40 blur-sm rounded-full"
               animate={{ y: [-5, -20], opacity: [0, 0.6, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
             />
             <motion.div 
               className="w-1 h-3 bg-white/30 blur-sm rounded-full"
               animate={{ y: [-5, -15], opacity: [0, 0.5, 0] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             />
          </div>
        )}
        
        {/* Çay Bardağı */}
        <motion.img 
          src="/images/items/tea.png" 
          alt="Çay" 
          className="w-full h-full object-contain drop-shadow-xl origin-bottom-center"
          // İçilme Animasyonu: Hafifçe yana eğilip geri gelir
          animate={isDrinking ? { rotate: [0, 15, 0], scale: [1, 0.9, 1] } : {}}
          transition={{ duration: 0.5 }}
          // Çay azaldıkça şeffaflaşır (İçini boşaltamadığımız için soluklaştırıyoruz)
          style={{ opacity: 0.4 + (sips / 8) }} 
        />

        {/* Bittiğinde X işareti veya yazı çıkabilir */}
        {sips === 0 && (
            <div className="absolute bottom-0 text-white/50 text-xs font-bold bg-black/50 px-2 py-1 rounded">Boş</div>
        )}
      </div>
    </InteractiveItem>
  );
};

export default TeaCup;