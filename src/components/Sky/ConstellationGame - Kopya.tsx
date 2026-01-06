'use client';

import React, { useState, useMemo } from 'react';
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

  // --- SESLER ---
  const sounds = useMemo(() => {
    return {
      starClick: new Howl({ src: ['/sounds/glitch.mp3'], volume: 0.2, rate: 3.0 }), 
      success: new Howl({ src: ['/sounds/bg-music.mp3'], volume: 0.5 }), 
    };
  }, []);

  // --- KOORDİNATLAR (REVİZE EDİLDİ) ---
  // Senin şeklini korudum ama Y ekseninde (dikeyde) aralarını açtım.
  // Böylece daha "uzun" ve estetik duruyor.
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
        sounds.success.play();
      }, 500);
    }
  };

  const isLineActive = (conn: Connection) => {
    return activePoints.includes(conn.from) && activePoints.includes(conn.to);
  };

  return (
    // MERKEZLEYİCİ WRAPPER (Bu div, oyunu ekranın tam ortasına sabitler)
    <div className="flex items-center justify-center w-full h-full">
      
      {/* 
         OYUN ALANI (CONTAINER) 
         İşte sır burada: max-w ve max-h vererek alanı kısıtlıyoruz.
         Böylece % değerleri tüm ekrana yayılmıyor, bu kutunun içine yayılıyor.
      */}
      <div className="relative w-full h-full max-w-[500px] max-h-[750px]">
      
        {/* --- CSS STYLES --- */}
        <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); } /* 0% yerine 50% yaptım, animasyon düzelir */
          100% { opacity: 0.7; transform: scale(1); }
        }
        
        .star {
          position: relative;
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 0 12px 2px rgba(255, 255, 255, 0.8);
          animation: twinkle 3s infinite ease-in-out;
          width: 10px; /* Biraz daha belirgin olması için büyüttüm */
          height: 10px;
          transition: all 0.3s ease;
        }

        /* Tıklandığında morlaşan hali */
        .star.active {
          background-color: #d8b4fe; 
          box-shadow: 0 0 15px 4px rgba(192, 132, 252, 0.9);
          animation: none; 
          transform: scale(1.2);
          border-radius: 50% !important;
        }
        `}</style>

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
                stroke={isActive ? "#c084fc" : "rgba(255, 255, 255, 0.1)"} // Pasifken çok silik
                strokeWidth={isActive ? 2 : 1}
                initial={false}
                animate={{ 
                    pathLength: isActive ? 1 : 0, // Sadece aktifken çizilsin (isteğe bağlı)
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
            // Button sadece tıklama alanıdır (hitbox), görünmezdir
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

      {/* 4. FINAL MODAL (Ekranın Ortasında Bağımsız) */}
      <AnimatePresence>
        {isCompleted && (
          <>
            <div className="fixed inset-0 pointer-events-none z-40">
                 <Confetti 
                    width={width} 
                    height={height} 
                    numberOfPieces={150} 
                    gravity={0.15} 
                    colors={['#fbbf24', '#d8b4fe', '#ffffff']} 
                    recycle={false} 
                />
            </div>
            
            <div className="absolute inset-x-0 bottom-[10%] z-50 flex justify-center p-4">
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