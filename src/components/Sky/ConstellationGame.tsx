import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { Sparkles } from 'lucide-react';

// Yıldız koordinatları - Daha dengeli bir "Mühür" yapısı
const STARS = [
  { id: 1, x: 50, y: 15 }, // En Tepe Noktası
  { id: 2, x: 50, y: 35 }, // Gövde Üst Merkezi
  { id: 3, x: 25, y: 45 }, // Sol Omuz
  { id: 4, x: 75, y: 45 }, // Sağ Omuz
  { id: 5, x: 30, y: 75 }, // Alt Sol Ayak
  { id: 6, x: 70, y: 75 }, // Alt Sağ Ayak
];

// Bağlantı Mantığı - Kesin olarak istenen tüm bağlar burada
const CONNECTIONS = [
  [1, 2], // En Tepe -> Gövde (Dikey)
  [2, 3], // Gövde -> Sol Omuz
  [2, 4], // Gövde -> Sağ Omuz
  [3, 5], // Sol Omuz -> Alt Sol
  [4, 6], // Sağ Omuz -> Alt Sağ
  [5, 6], // Alt Sol -> Alt Sağ (Yatay Taban)
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
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: ['#a855f7', '#ffffff'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: ['#6366f1', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-12">
      
      {/* OYUN ALANI (Yıldızlar ve Çizgiler) */}
      <div className="relative w-full max-w-[500px] aspect-[3/4] select-none mx-auto">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {CONNECTIONS.map(([startId, endId], i) => {
            const s = STARS.find(star => star.id === startId);
            const e = STARS.find(star => star.id === endId);
            const isConnected = activeStars.includes(startId) && activeStars.includes(endId);

            if (!s || !e || !isConnected) return null;

            return (
              <motion.line
                key={`line-${startId}-${endId}`}
                x1={`${s.x}%`} y1={`${s.y}%`}
                x2={`${e.x}%`} y2={`${e.y}%`}
                stroke="#e9d5ff"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            );
          })}
        </svg>

        {STARS.map((star) => {
          const isActive = activeStars.includes(star.id);
          return (
            <div
              key={star.id}
              onClick={() => handleStarClick(star.id)}
              className="absolute z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center group"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
            >
              {/* Yıldız Görseli */}
              <div className="relative">
                <motion.div 
                  animate={isActive ? { scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0.2 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-purple-400 rounded-full blur-xl -m-4"
                />
                <motion.div
                  animate={isActive ? { rotate: 180, scale: 1.2 } : { rotate: 0, scale: 1 }}
                  className={`transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white/50'}`}
                >
                  <Sparkles size={isActive ? 32 : 24} fill={isActive ? "white" : "none"} />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUTON ALANI - Constellation'dan bağımsız, en altta hizalı */}
      <div className="h-32 flex flex-col items-center justify-center w-full">
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <button
                onClick={() => changeScene('letter')}
                className="px-16 py-5 bg-white text-indigo-950 font-black rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all tracking-[0.3em] uppercase text-sm flex items-center gap-4 group"
              >
                Mührü Çöz
                <Sparkles className="w-5 h-5 text-purple-600 group-hover:rotate-12 transition-transform" />
              </button>
              <motion.p 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/60 text-[11px] tracking-[0.4em] uppercase font-light"
              >
                Göklerin kapısı aralanıyor
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConstellationGame;