import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { Sparkles } from 'lucide-react';

// İsteğine uygun yeni koordinatlar
const STARS = [
  { id: 1, x: 50, y: 10 }, // 1. Tepe Noktası
  { id: 2, x: 50, y: 30 }, // 2. Boyun
  { id: 3, x: 30, y: 40 }, // 3. Sol Omuz
  { id: 4, x: 70, y: 40 }, // 4. Sağ Omuz
  { id: 5, x: 45, y: 70 }, // 5. Alt Sol
  { id: 6, x: 55, y: 70 }, // 6. Alt Sağ
];

// Bağlantı Mantığı (Şeklin bütünlüğü için)
const CONNECTIONS = [
  [1, 2], // Tepe -> Boyun
  [2, 3], // Boyun -> Sol
  [2, 4], // Boyun -> Sağ
  [3, 5], // Sol -> Alt Sol
  [4, 6], // Sağ -> Alt Sağ
  [5, 6], // Alt uç birleşimi (Opsiyonel, şekli kapatmak için)
];

const ConstellationGame = () => {
  const { playSound, changeScene } = useGame();
  
  const [activeStars, setActiveStars] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Ses ve aktivasyon mantığı
  const handleStarClick = (id: number) => {
    if (isComplete) return;

    if (!activeStars.includes(id)) {
      playSound('pop'); // Veya daha "magical" bir ses
      const newActive = [...activeStars, id];
      setActiveStars(newActive);
      
      if (newActive.length === STARS.length) {
        setIsComplete(true);
        setTimeout(handleWinEffects, 800);
      }
    }
  };

  const handleWinEffects = () => {
    playSound('sparkle');
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#d8b4fe', '#ffffff'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#a855f7', '#d8b4fe'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  return (
    <div className="relative w-full h-full max-w-[600px] max-h-[800px] select-none mx-auto">
      
      {/* SVG KATMANI (Sadece Bağlantılar İçin) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        <defs>
          {/* Çizgi için Neon Glow Efekti */}
          <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Çizgi Gradients */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {CONNECTIONS.map(([startId, endId], i) => {
          const s = STARS.find(star => star.id === startId);
          const e = STARS.find(star => star.id === endId);
          
          // Sadece iki uçtaki yıldız da aktifse çizgi var olur
          const isConnected = activeStars.includes(startId) && activeStars.includes(endId);

          if (!s || !e || !isConnected) return null;

          return (
            <motion.line
              key={`conn-${i}`}
              x1={`${s.x}%`} y1={`${s.y}%`}
              x2={`${e.x}%`} y2={`${e.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#line-glow)"
              // Çizim Animasyonu: 0'dan 1'e doğru çizilir
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {/* YILDIZLAR KATMANI */}
      {STARS.map((star) => {
        const isActive = activeStars.includes(star.id);

        return (
          <div
            key={star.id}
            onClick={() => handleStarClick(star.id)}
            className="absolute z-20 cursor-pointer w-16 h-16 flex items-center justify-center group"
            style={{ 
                left: `${star.x}%`, 
                top: `${star.y}%`,
                transform: 'translate(-50%, -50%)' 
            }}
          >
            {/* Tıklama Alanı (Görünmez ama geniş) */}
            <div className="absolute inset-0 rounded-full" />

            {/* YILDIZ GÖRSELİ */}
            <div className="relative flex items-center justify-center">
                
                {/* 1. Dış Glow (Sadece Aktifken büyür) */}
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isActive ? { scale: 1.5, opacity: 0.4 } : { scale: 0, opacity: 0 }}
                    className="absolute w-12 h-12 bg-purple-500 rounded-full blur-xl"
                />

                {/* 2. Dönen Kare (Elmas Efekti) */}
                <motion.div 
                    className={`absolute w-3 h-3 border border-purple-300/50 rotate-45 transition-all duration-500
                        ${isActive ? 'bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-125' : 'bg-transparent scale-100'}
                    `}
                    animate={{ rotate: 45 }} // Sabit duruş, isteğe göre rotate artırılabilir
                />

                {/* 3. Ana Yıldız Şekli (SVG - 4 Köşeli Sparkle) */}
                <motion.svg
                    viewBox="0 0 24 24"
                    className={`w-8 h-8 transition-all duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]
                        ${isActive ? 'text-white scale-110' : 'text-white/40 scale-75 hover:scale-90 hover:text-white/70'}
                    `}
                    initial={false}
                    animate={isActive ? { rotate: [0, 90, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </motion.svg>
                
                {/* 4. Merkez Çekirdek (Parlak Nokta) */}
                <div className={`absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />

            </div>
          </div>
        );
      })}

      {/* FINAL BUTONU */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-[-5%] left-0 right-0 flex justify-center z-50"
          >
            <button
              onClick={() => changeScene('letter')}
              className="group relative flex items-center gap-3 px-10 py-4 text-white uppercase bg-transparent overflow-hidden rounded-full transition-all"
            >
              {/* Buton Arkaplan Efekti */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity blur-sm rounded-full" />
              <div className="absolute inset-0 w-full h-full border border-white/20 rounded-full" />
              
              <span className="relative z-10 font-bold tracking-[0.2em] text-lg drop-shadow-md">Mührü Çöz</span>
              <Sparkles className="relative z-10 w-5 h-5 animate-pulse text-purple-200" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstellationGame;