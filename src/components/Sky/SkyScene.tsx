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

      className="fixed inset-0 z-50 w-full h-full overflow-hidden bg-[#1a0b2e]"
    >

      <div 
        className="absolute inset-0 opacity-90"
        style={{
            background: 'radial-gradient(circle at center, #6b21a8 0%, #3b0764 40%, #1e0536 80%, #0a0214 100%)'
        }}
      />
      

      <div className="absolute inset-0 opacity-50" style={{ 
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}></div>


      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay"></div>


      <button 
        onClick={handleBack}
        className="absolute top-8 left-8 z-[60] flex items-center gap-2 px-5 py-2.5 text-white/80 transition-all duration-300 rounded-full group hover:text-white hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-light tracking-widest uppercase font-inter">
          Odaya Dön
        </span>
      </button>


      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <ConstellationGame />
      </div>
    </motion.div>
  );
};

export default SkyScene;