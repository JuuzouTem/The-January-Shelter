'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { Howl } from 'howler';
import { useGame } from '@/context/GameContext'; 

type Point = { id: number; x: number; y: number };
type Connection = { from: number; to: number };
type BgStar = { id: number; x: number; y: number; size: number; delay: number; duration: number; opacity: number };

const ConstellationGame = () => {
  const { width, height } = useWindowSize();
  
  const { changeScene, unlockCake, isConstellationSolved, solveConstellation, isCakeUnlocked } = useGame(); 

  const points: Point[] = [
    { id: 1, x: 48, y: 16.5 }, 
    { id: 2, x: 48, y: 32 }, 
    { id: 3, x: 30, y: 39.3 }, 
    { id: 4, x: 67, y: 39.3 }, 
    { id: 5, x: 42.7, y: 69.8 }, 
    { id: 6, x: 54.5, y: 69.5 }, 
  ];

  const [activePoints, setActivePoints] = useState<number[]>(
    isConstellationSolved ? points.map(p => p.id) : []
  );

  const [isCompleted, setIsCompleted] = useState(isConstellationSolved);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [backgroundStars, setBackgroundStars] = useState<BgStar[]>([]);

  const connections: Connection[] = [
    { from: 1, to: 2 }, 
    { from: 2, to: 3 }, 
    { from: 2, to: 4 }, 
    { from: 3, to: 5 }, 
    { from: 4, to: 6 }, 
    { from: 5, to: 6 }, 
  ];

  const sounds = useMemo(() => {
    return {
      starClick: new Howl({ src: ['/sounds/home1.mp3'], volume: 0.2, rate: 1.0 }), 
      success: new Howl({ src: ['/sounds/cons.mp3'], volume: 0.5 }), 
      intro: new Howl({ 
        src: ['/sounds/cons_sound.mp3'], 
        volume: 0.4,
        html5: true
      }), 
    };
  }, []);

  useEffect(() => {
    const stars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,      
      y: Math.random() * 100,      
      size: Math.random() * 3 + 1, 
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      opacity: Math.random() * 0.5 + 0.1 
    }));
    setBackgroundStars(stars);
  }, []);

  useEffect(() => {
    sounds.intro.play();
  }, [sounds]);

  const handlePointClick = (id: number) => {
    if (activePoints.includes(id) || isCompleted) return;

    sounds.starClick.play();
    const newActive = [...activePoints, id];
    setActivePoints(newActive);

    if (newActive.length === points.length) {
      setTimeout(() => {
        setIsCompleted(true);
        setShowConfetti(true);
        sounds.success.play();
        
        solveConstellation(); 
        
      }, 500);
    }
  };

  const isLineActive = (conn: Connection) => {
    return activePoints.includes(conn.from) && activePoints.includes(conn.to);
  };

  const handleUnlockSeal = () => {
    unlockCake(); 
    changeScene('room'); 
  };

  const sealImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfMAAAH0CAYAAAApCsTzAAA...vSdQNQAAAAZJREFUAwDSFkOjth8rKgAAAABJRU5ErkJggg=="; 

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
        
        <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
          100% { opacity: 0.7; transform: scale(1); }
        }
        .star-main {
            position: relative;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 0 12px 2px rgba(255, 255, 255, 0.8);
            animation: twinkle 3s infinite ease-in-out;
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
        }
        .star-main.active {
            background-color: #d8b4fe; 
            box-shadow: 0 0 15px 4px rgba(192, 132, 252, 0.9);
            animation: none; 
            transform: scale(1.2);
        }
        .star-bg {
            position: absolute;
            background-color: white;
            border-radius: 50%;
        }
        `}</style>

        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
            {backgroundStars.map((star) => (
                <div
                    key={`bg-star-${star.id}`}
                    className="star-bg"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        boxShadow: `0 0 ${star.size + 2}px rgba(255, 255, 255, 0.4)`,
                        animationName: 'twinkle',
                        animationDuration: `${star.duration}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'ease-in-out',
                        animationDelay: `${star.delay}s`
                    }}
                />
            ))}
        </div>

      <div className="relative w-full h-full max-w-[500px] max-h-[750px] z-10">
      
         <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center opacity-80 z-0">
              <div className="w-full h-full -translate-x-[59px] -translate-y-[-15px]">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -65 660 950">
                <image width="800" height="800" xlinkHref={sealImageBase64} />
             </svg>
        </div>
    </div>

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
                animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0.2 }}
                transition={{ duration: 1.5 }}
                style={{ filter: isActive ? "drop-shadow(0 0 8px #fbbf24)" : "none" }}
                />
            );
            })}
        </svg>

      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
        {points.map((point) => {
          const isActive = activePoints.includes(point.id);
          return (
            <button
              key={point.id}
              onClick={() => handlePointClick(point.id)}
              className={`absolute w-10 h-10 flex items-center justify-center pointer-events-auto focus:outline-none bg-transparent border-none p-0 -translate-x-1/2 -translate-y-1/2 ${isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
                <div 
                    className={`star-main ${isActive ? 'active' : ''}`} 
                    style={{ animationDelay: `${point.id * 0.5}s` }} 
                />
            </button>
          );
        })}
      </div>
      
      <AnimatePresence>
        {isCompleted && !isCakeUnlocked && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute bottom-[5%] left-[190] right-0 flex justify-center z-50 pointer-events-auto"
           >
              <button
                  onClick={handleUnlockSeal} 
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full text-sm tracking-[0.2em] uppercase font-bold shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all border border-white/20 backdrop-blur-sm"
              >
                  MÜHRÜ AÇ
              </button>
           </motion.div>
        )}
      </AnimatePresence>

      </div>

      <AnimatePresence>
        {isCompleted && showConfetti && width > 0 && height > 0 && (
             <Confetti 
                width={width} 
                height={height} 
                numberOfPieces={200} 
                gravity={0.2} 
                initialVelocityY={10} 
                colors={['#fbbf24', '#d8b4fe', '#ffffff', '#c084fc']} 
                recycle={false} 
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstellationGame;