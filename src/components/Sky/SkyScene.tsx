import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useGame } from '@/context/GameContext'; // Hook kullanımı
import ConstellationGame from './ConstellationGame';

const SkyScene = () => {
  // useGame hook'unu kullanıyoruz
  const { changeScene, playSound } = useGame();

  const handleBack = () => {
    playSound('click'); 
    changeScene('room'); // setScene yerine changeScene
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-50 w-full h-full overflow-hidden bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]"
    >
      {/* Yıldız Arka Planı */}
      <div className="absolute inset-0 opacity-40" style={{ 
        backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
        backgroundSize: '50px 50px' 
      }}></div>

      {/* Geri Dön Butonu */}
      <button 
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 text-white/70 transition-all duration-300 rounded-full group hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/5 hover:border-white/20"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-light tracking-widest uppercase font-inter">
          Sığınağa Dön
        </span>
      </button>

      {/* Oyun Alanı */}
      <div className="relative flex items-center justify-center w-full h-full">
        <ConstellationGame />
      </div>
    </motion.div>
  );
};

export default SkyScene;