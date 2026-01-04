'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

const SnowFall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // İstemci tarafında rastgele kar taneleri oluştur
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // % olarak
      y: -10, // Ekranın üstünden başlasın
      duration: Math.random() * 5 + 5, // 5-10 saniye arası düşüş
      delay: Math.random() * 5,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-70"
          style={{
            left: `${flake.x}%`,
            width: '4px',
            height: '4px',
            top: '-10px',
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.random() * 20 - 10], // Hafif sağa sola salınım
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default SnowFall;