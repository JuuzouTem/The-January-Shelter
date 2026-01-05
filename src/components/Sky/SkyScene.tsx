import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useGame } from '@/context/GameContext'; 
import ConstellationGame from './ConstellationGame';

const SkyScene = () => {
  const { changeScene, playSound } = useGame();

  const handleBack = () => {
    playSound('click'); 
    changeScene('room'); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      // Z-Index 50 ve bg-colors eklendi
      className="fixed inset-0 z-50 w-full h-full overflow-hidden bg-[#0a0616]"
    >
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#1e1b4b] to-[#312e81] opacity-80" />
      
      {/* Yıldız Efekti (CSS) */}
      <div className="absolute inset-0 opacity-40" style={{ 
        backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}></div>

      {/* Geri Dön Butonu */}
      <button 
        onClick={handleBack}
        className="absolute top-8 left-8 z-[60] flex items-center gap-2 px-5 py-2.5 text-white/80 transition-all duration-300 rounded-full group hover:text-white hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-light tracking-widest uppercase font-inter">
          Odaya Dön
        </span>
      </button>

      {/* Oyun Alanı Ortala */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        {/* Constellation Game */}
        <ConstellationGame />
      </div>
    </motion.div>
  );
};

export default SkyScene;