import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti'; 
import { useGame } from '@/context/GameContext'; // Hook
import { Sparkles } from 'lucide-react';

// Koordinatlar
const STARS = [
  { id: 1, x: 20, y: 70 },
  { id: 2, x: 35, y: 50 },
  { id: 3, x: 50, y: 30 }, 
  { id: 4, x: 65, y: 50 },
  { id: 5, x: 80, y: 70 },
  { id: 6, x: 50, y: 60 }, 
];

const CONNECTIONS = [
  [1, 2], [2, 3], [3, 4], [4, 5], 
  [2, 6], [4, 6], [6, 3]          
];

const ConstellationGame = () => {
  // useGame ile context'i alıyoruz
  const { playSound, changeScene } = useGame(); // setScene -> changeScene
  
  const [activeStars, setActiveStars] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleStarClick = (id: number) => {
    if (isComplete) return;

    if (!activeStars.includes(id)) {
      playSound('pop'); 
      const newActive = [...activeStars, id];
      setActiveStars(newActive);
      checkCompletion(newActive);
    }
  };

  const checkCompletion = (currentActive: number[]) => {
    if (currentActive.length === STARS.length) {
      setIsComplete(true);
      handleWin();
    }
  };

  const handleWin = () => {
    playSound('sparkle');
    
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7c3aed', '#fbbf24', '#e2e8f0']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7c3aed', '#fbbf24', '#e2e8f0']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="relative w-[90vw] h-[60vh] max-w-4xl max-h-[600px]">
      
      {/* SVG Çizgiler */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {CONNECTIONS.map(([startId, endId]) => {
          const start = STARS.find(s => s.id === startId);
          const end = STARS.find(s => s.id === endId);
          
          if (!start || !end) return null;

          const isLineActive = activeStars.includes(startId) && activeStars.includes(endId);

          return (
            <motion.line
              key={`${startId}-${endId}`}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: isLineActive ? 1 : 0, 
                opacity: isLineActive ? 0.6 : 0.1 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              stroke={isLineActive ? "#fbbf24" : "#ffffff"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Yıldızlar */}
      {STARS.map((star) => {
        const isActive = activeStars.includes(star.id);

        return (
          <motion.div
            key={star.id}
            onClick={() => handleStarClick(star.id)}
            className="absolute z-10 cursor-pointer"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2">
              <motion.div 
                className={`w-3 h-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-colors duration-500 ${isActive ? 'bg-amber-300 shadow-[0_0_25px_#fbbf24]' : 'bg-slate-400'}`}
              />
              {isActive && (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full border border-amber-300/50"
                />
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Final Butonu (LetterModal'a gider) */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-[-10%] left-0 right-0 flex justify-center z-20"
          >
            <button
              // BURAYA DİKKAT: letter sahnesine yolluyoruz
              onClick={() => changeScene('letter')} 
              className="flex items-center gap-3 px-8 py-3 text-lg font-medium text-white shadow-2xl bg-violet-600 rounded-xl hover:bg-violet-500 transition-all hover:scale-105 shadow-violet-500/30"
            >
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              <span>Hediyeyi Aç</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstellationGame;