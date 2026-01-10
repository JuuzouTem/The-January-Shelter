'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import InteractiveItem from './InteractiveItem';

const PlantGlitch = () => {
  const [isShaking, setIsShaking] = useState(false);

  const interactSound = new Howl({
    src: ['/sounds/plant.mp3'], 
    volume: 0.5,
  });

  const triggerShake = () => {
    if (isShaking) return;
    
    setIsShaking(true);
    interactSound.play();
    
    setTimeout(() => {
      setIsShaking(false);
    }, 600);
  };

  return (
    <InteractiveItem onClick={triggerShake} label="Bitki" className="w-24 h-24 md:w-32 md:h-32">
      <motion.div>
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