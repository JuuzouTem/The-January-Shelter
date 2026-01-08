'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import InteractiveItem from './InteractiveItem';

const PlantGlitch = () => {
  const [isShaking, setIsShaking] = useState(false);

  // Ses dosyasını yükle
  // Not: Eğer elinde yaprak hışırtısı sesi varsa dosya yolunu güncelleyebilirsin.
  const interactSound = new Howl({
    src: ['/sounds/glitch.mp3'], 
    volume: 0.5,
  });

  const triggerShake = () => {
    // Halihazırda sallanıyorsa tekrar tetikleme
    if (isShaking) return;
    
    setIsShaking(true);
    interactSound.play();
    
    // Animasyon süresi kadar bekle ve state'i sıfırla
    setTimeout(() => {
      setIsShaking(false);
    }, 600);
  };

  return (
    <InteractiveItem onClick={triggerShake} label="Bitki" className="w-24 h-24 md:w-32 md:h-32">
      <motion.div>
        {/* Bitki Görseli */}
        <img 
          src="/images/items/plant.png" 
          alt="Bitki" 
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </motion.div>
    </InteractiveItem>
  );
};

export default PlantGlitch;