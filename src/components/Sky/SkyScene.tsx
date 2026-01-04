'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import ConstellationGame from './ConstellationGame';
import LetterModal from '../UI/LetterModal';
import SnowFall from '../Effects/SnowFall'; // Uzayda kar olmaz ama atmosferik toz diyelim :)

const SkyScene = () => {
  const { changeScene } = useGame();
  const [showLetter, setShowLetter] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full bg-gradient-to-b from-[#050510] via-[#1a103c] to-[#0a0f1e] flex items-center justify-center overflow-hidden"
    >
      {/* Arka Plan Yıldızları (Parallax veya sabit) */}
      <div className="absolute inset-0 z-0">
         <SnowFall /> {/* Mevcut efekti yıldız gibi kullanıyoruz */}
      </div>

      {/* Geri Dön Butonu */}
      <button 
        onClick={() => changeScene('room')}
        className="absolute top-8 left-8 z-50 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Odaya Dön
      </button>

      {/* Oyun Alanı */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {!showLetter && (
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.5, duration: 1 }}
           >
             <h2 className="text-center text-accent/80 text-lg mb-8 tracking-[0.5em] uppercase font-light">
               Yıldızları Birleştir
             </h2>
             <ConstellationGame onComplete={() => setShowLetter(true)} />
           </motion.div>
        )}
      </div>

      {/* Mektup Modalı */}
      <LetterModal isOpen={showLetter} onClose={() => setShowLetter(false)} />

    </motion.div>
  );
};

export default SkyScene;