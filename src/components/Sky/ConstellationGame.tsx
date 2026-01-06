import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { Sparkles } from 'lucide-react';

// Yıldız koordinatları - Daha dengeli ve ekranın ortasına odaklı
const STARS = [
  { id: 1, x: 50, y: 20 }, // En Tepe
  { id: 2, x: 50, y: 40 }, // Gövde Üst (Merkez)
  { id: 3, x: 25, y: 50 }, // Sol Kanat
  { id: 4, x: 75, y: 50 }, // Sağ Kanat
  { id: 5, x: 35, y: 75 }, // Alt Sol
  { id: 6, x: 65, y: 75 }, // Alt Sağ
];

// Bağlantı Mantığı - Tam bir geometrik mühür oluşturur
const CONNECTIONS = [
  [1, 2], // Tepe -> Gövde
  [2, 3], // Gövde -> Sol
  [2, 4], // Gövde -> Sağ
  [3, 5], // Sol -> Alt Sol
  [4, 6], // Sağ -> Alt Sağ
  [5, 6], // Alt Sol -> Alt Sağ (Taban birleşimi)
];

const ConstellationGame = () => {
  const { playSound, changeScene } = useGame();
  
  const [activeStars, setActiveStars] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleStarClick = (id: number) => {
    if (isComplete) return;

    if (!activeStars.includes(id)) {
      playSound('pop'); 
      const newActive = [...activeStars, id];
      setActiveStars(newActive);
      
      if (newActive.length === STARS.length) {
        setIsComplete(true);
        handleWinEffects();
      }
    }
  };

  const handleWinEffects = () => {
    playSound('sparkle');
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ 
        particleCount: 3, 
        angle: 60, 
        spread: 55, 
        origin: { x: 0, y: 0.8 }, 
        colors: ['#a855f7', '#ffffff', '#6366f1'] 
      });
      confetti({ 
        particleCount: 3, 
        angle: 120, 
        spread: 55, 
        origin: { x: 1, y: 0.8 }, 
        colors: ['#a855f7', '#ffffff', '#6366f1'] 
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  return (
    <div className="relative w-full h-[85vh] max-w-[500px] select-none mx-auto flex items-center justify-center">
      
      {/* SVG KATMANI (Bağlantılar) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        <defs>
          <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </linearGradient>
        </defs>

        {CONNECTIONS.map(([startId, endId], i) => {
          const s = STARS.find(star => star.id === startId);
          const e = STARS.find(star => star.id === endId);
          const isConnected = activeStars.includes(startId) && activeStars.includes(endId);

          if (!s || !e || !isConnected) return null;

          return (
            <motion.line
              key={`conn-${i}`}
              x1={`${s.x}%`} y1={`${s.y}%`}
              x2={`${e.x}%`} y2={`${e.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#line-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          );
        })}
      </svg>

      {/* YILDIZLAR */}
      {STARS.map((star) => {
        const isActive = activeStars.includes(star.id);

        return (
          <div
            key={star.id}
            onClick={() => handleStarClick(star.id)}
            className="absolute z-20 cursor-pointer w-12 h-12 flex items-center justify-center group"
            style={{ 
                left: `${star.x}%`, 
                top: `${star.y}%`,
                transform: 'translate(-50%, -50%)' 
            }}
          >
            {/* Etkileşim Alanı Parlaması (Tıklanmamışken rehberlik eder) */}
            {!isActive && !isComplete && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-full h-full bg-white/10 rounded-full blur-md"
              />
            )}

            <div className="relative flex items-center justify-center">
                {/* Aktif Glow */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={isActive ? { scale: 1.5, opacity: 0.6 } : { scale: 0 }}
                    className="absolute w-10 h-10 bg-purple-400 rounded-full blur-xl"
                />

                {/* Yıldız Simgesi */}
                <motion.div
                    className={`relative transition-all duration-500
                        ${isActive ? 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,1)]' : 'text-white/30 scale-90 group-hover:text-white/60'}
                    `}
                    animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.8 }}
                >
                  <Sparkles className={isActive ? "w-8 h-8" : "w-6 h-6"} />
                </motion.div>
            </div>
          </div>
        );
      })}

      {/* FINAL BUTONU - Daha belirgin ve merkezi */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeScene('letter')}
              className="px-12 py-4 bg-white text-indigo-950 font-bold rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] transition-all tracking-[0.2em] uppercase text-sm flex items-center gap-3"
            >
              Mührü Çöz
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.button>
            <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Göklerin kapısı aralanıyor</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstellationGame;