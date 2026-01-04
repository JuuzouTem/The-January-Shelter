'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  id: number;
  x: number; // Yüzde olarak (0-100)
  y: number; // Yüzde olarak (0-100)
}

// Flins Takımyıldızı Koordinatları (Referans görsele göre yaklaşık)
const stars: Point[] = [
  { id: 1, x: 50, y: 15 }, // En tepe
  { id: 2, x: 50, y: 30 }, // Boyun
  { id: 3, x: 35, y: 45 }, // Sol omuz
  { id: 4, x: 65, y: 45 }, // Sağ omuz
  { id: 5, x: 50, y: 60 }, // Göbek
  { id: 6, x: 45, y: 80 }, // Alt sol
  { id: 7, x: 55, y: 80 }, // Alt sağ
];

// Bağlantı çizgileri (Hangi yıldız hangisine bağlı)
const connections = [
  [1, 2],
  [2, 3], [2, 4], // Omuzlar
  [3, 5], [4, 5], // Gövde birleşimi
  [5, 6], [5, 7], // Alt kısım
  [6, 7] // Taban kapatma
];

interface Props {
  onComplete: () => void;
}

const ConstellationGame = ({ onComplete }: Props) => {
  const [activeStars, setActiveStars] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Yıldız tıklama mantığı
  const handleStarClick = (id: number) => {
    if (activeStars.includes(id)) return;
    
    // Basit olması için sıra zorunluluğu koymuyorum, kullanıcı keşfetsin.
    // Ama hepsi seçilince oyun biter.
    const newActive = [...activeStars, id];
    setActiveStars(newActive);

    if (newActive.length === stars.length) {
      setTimeout(() => {
        setIsCompleted(true);
        setTimeout(onComplete, 2000); // Patlamadan sonra mektubu aç
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full max-w-lg mx-auto aspect-[3/4]">
      
      {/* SVG Çizgileri (Arka planda çizilir) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections.map(([startId, endId], index) => {
          const start = stars.find(s => s.id === startId)!;
          const end = stars.find(s => s.id === endId)!;
          
          // İki uçtaki yıldız da aktifse çizgi görünür
          const isVisible = activeStars.includes(startId) && activeStars.includes(endId);

          return (
            <motion.line
              key={`${startId}-${endId}`}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke="#a855f7" // Mor renk
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isVisible ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1 }}
            />
          );
        })}
      </svg>

      {/* Yıldızlar (Butonlar) */}
      {stars.map((star) => {
        const isActive = activeStars.includes(star.id);
        
        return (
          <motion.button
            key={star.id}
            onClick={() => handleStarClick(star.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-4 group" // Tıklama alanı geniş
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Yıldızın görsel hali */}
            <motion.div
              className={`w-4 h-4 rounded-full ${isActive ? 'bg-white shadow-[0_0_15px_#d8b4fe]' : 'bg-gray-600/50'}`}
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Hale efekti */}
            {!isActive && (
               <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" />
            )}
          </motion.button>
        );
      })}

      {/* Final Patlaması (Göz yormayan soft mor) */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="w-64 h-64 bg-accent/30 rounded-full blur-[80px]" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute w-full h-full border-2 border-accent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstellationGame;