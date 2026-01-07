'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { Howl } from 'howler';
import { useGame } from '@/context/GameContext'; 
import { Sparkles } from 'lucide-react'; 

// --- TİP TANIMLAMALARI ---
type Point = { id: number; x: number; y: number };
type Connection = { from: number; to: number };

const ConstellationGame = () => {
  const { width, height } = useWindowSize();
  const { changeScene } = useGame();
  const [activePoints, setActivePoints] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- SESLER ---
  const sounds = useMemo(() => {
    return {
      starClick: new Howl({ src: ['/sounds/glitch.mp3'], volume: 0.2, rate: 3.0 }), 
      success: new Howl({ src: ['/sounds/bg-music.mp3'], volume: 0.5 }), 
    };
  }, []);

  // --- KOORDİNATLAR ---
  const points: Point[] = [
    { id: 1, x: 48, y: 16.5 }, // Tepe (Biraz aşağı indi)
    { id: 2, x: 48, y: 32 }, // Boyun (Aşağı indi)
    { id: 3, x: 30, y: 39.3 }, // Sol Kanat (Sola ve aşağı açıldı)
    { id: 4, x: 67, y: 39.3 }, // Sağ Kanat (Sağa ve aşağı açıldı)
    { id: 5, x: 42.7, y: 69.8 }, // Alt Sol (Bayağı aşağı indi)
    { id: 6, x: 54.5, y: 69.5 }, // Alt Sağ (Bayağı aşağı indi)
  ];

  // --- BAĞLANTILAR ---
  const connections: Connection[] = [
    { from: 1, to: 2 }, 
    { from: 2, to: 3 }, 
    { from: 2, to: 4 }, 
    { from: 3, to: 5 }, 
    { from: 4, to: 6 }, 
    { from: 5, to: 6 }, 
  ];

  const handlePointClick = (id: number) => {
    if (activePoints.includes(id)) return;

    sounds.starClick.play();
    const newActive = [...activePoints, id];
    setActivePoints(newActive);

    if (newActive.length === points.length) {
      setTimeout(() => {
        setIsCompleted(true);
        setShowConfetti(true); // Konfetiyi tetikle
        sounds.success.play();
      }, 500);
    }
  };

  const isLineActive = (conn: Connection) => {
    return activePoints.includes(conn.from) && activePoints.includes(conn.to);
  };

  return (
    // MERKEZLEYİCİ WRAPPER
    <div className="flex items-center justify-center w-full h-full">
      
      {/* OYUN ALANI */}
      <div className="relative w-full h-full max-w-[500px] max-h-[750px]">
      
        <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
          100% { opacity: 0.7; transform: scale(1); }
        }
        
        .star {
          position: relative;
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 0 12px 2px rgba(255, 255, 255, 0.8);
          animation: twinkle 3s infinite ease-in-out;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }

        .star.active {
          background-color: #d8b4fe; 
          box-shadow: 0 0 15px 4px rgba(192, 132, 252, 0.9);
          animation: none; 
          transform: scale(1.2);
          border-radius: 50% !important;
        }
        `}</style>

         <div className="absolute inset-0 w-full h-full z-0 pointer-events-none flex items-center justify-center opacity-70">
              <div className="w-full h-full -translate-x-[59px] -translate-y-[-15px]">
             <svg 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 -65 660 950" 
             >
                <image 
                    width="800" 
                    height="800" 
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfMAAAH0CAYAAAApCsTzAAAQAElEQVR4AeydBWAUR/vwZ9bPLy64S3BSXAsUl+Juxa24S3B3d5cGK1AcmrZIcQ8OAQIhnpyvz3d5/==" 
                />
             </svg>
        </div>
    </div>

        {/* 2. ÇİZGİLER (SVG Layer) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            {connections.map((conn, index) => {
            const p1 = points.find((p) => p.id === conn.from);
            const p2 = points.find((p) => p.id === conn.to);
            
            if (!p1 || !p2) return null;
            const isActive = isLineActive(conn);

            return (
                <motion.line
                key={`line-${index}`}
                x1={`${p1.x}%`}
                y1={`${p1.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke={isActive ? "#c084fc" : "rgba(255, 255, 255, 0.1)"}
                strokeWidth={isActive ? 2 : 1}
                initial={false}
                animate={{ 
                    pathLength: isActive ? 1 : 0, 
                    opacity: isActive ? 1 : 0.2,
                }}
                transition={{ duration: 1.5 }}
                style={{
                    filter: isActive ? "drop-shadow(0 0 8px #fbbf24)" : "none"
                }}
                />
            );
            })}
        </svg>

        {/* 3. YILDIZLAR */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
        {points.map((point) => {
          const isActive = activePoints.includes(point.id);

          return (
            <button
              key={point.id}
              onClick={() => handlePointClick(point.id)}
              className="absolute w-10 h-10 flex items-center justify-center pointer-events-auto focus:outline-none bg-transparent border-none p-0 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
                <div 
                    className={`star rounded-full ${isActive ? 'active' : ''}`} 
                    style={{ animationDelay: `${point.id * 0.5}s` }} 
                />
            </button>
          );
        })}
      </div>
      </div>

      {/* 
        4. KONFETİ VE FINAL MODAL 
        Konfeti bileşenini CSS style ile zorla 'fixed' yaptık ki 
        parent div'in transform/flex özelliklerinden etkilenmesin.
      */}
      <AnimatePresence>
        {isCompleted && (
          <>
            {/* Konfetiyi render etmek için window boyutlarını bekleyelim */}
            {showConfetti && width > 0 && height > 0 && (
                 <Confetti 
                    width={width} 
                    height={height} 
                    numberOfPieces={200} 
                    gravity={0.2} // Yerçekimi biraz artırıldı, daha doğal düşüş için
                    initialVelocityY={10} // Hafif bir patlama etkisi
                    colors={['#fbbf24', '#d8b4fe', '#ffffff', '#c084fc']} 
                    recycle={false} 
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}
                />
            )}
            
            <div className="absolute inset-x-0 bottom-[10%] z-[101] flex justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-6 rounded-2xl shadow-2xl text-center max-w-sm w-full"
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="text-amber-300 w-4 h-4" />
                        <h2 className="text-xl text-white font-dancing tracking-wide">
                            Yıldızlar Hizalandı
                        </h2>
                        <Sparkles className="text-amber-300 w-4 h-4" />
                    </div>

                    <p className="text-gray-300 text-xs mb-5 font-light">
                        Gökyüzü tamamlandı. Sırada ne var?
                    </p>
                    
                    <button
                        onClick={() => changeScene('letter')} 
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 text-white rounded-full text-xs tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
                    >
                        MÜHRÜ AÇ
                    </button>
                </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstellationGame;