import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import InteractiveItem from './InteractiveItem';

interface MusicBoxProps {
  onStateChange: (isOpen: boolean) => void;
}

const MusicBox: React.FC<MusicBoxProps> = ({ onStateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const soundIdRef = useRef<number | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sounds/music-box.mp3'],
      loop: true,
      volume: 0, 
      preload: true,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;

    sound.off('fade');

    if (isOpen) {
        sound.stop();
        
        const id = sound.play();
        soundIdRef.current = id;
        sound.fade(0, 0.4, 1000, id);

    } else {
        const id = soundIdRef.current;
        if (id && sound.playing(id)) {
            const currentVol = sound.volume(id) as number || sound.volume();
            
            sound.fade(currentVol, 0, 500, id);
            
            sound.once('fade', () => {
                sound.stop(id);
                soundIdRef.current = null;
            }, id);
        } else {
            sound.stop();
        }
    }
    
    onStateChange(isOpen);
  }, [isOpen, onStateChange]);

  const toggleBox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full h-full">
      <InteractiveItem label="Müzik Kutusu" onClick={toggleBox} className="w-full h-full">
        
        {isOpen && (
           <div className="absolute top-[-43%] left-[8%] w-[70%] h-auto z-100 pointer-events-none origin-bottom">
             <img 
               src="/images/items/ballerina.png"
               alt="Ballerina"
               className="w-full h-full object-contain"
               style={{ animation: 'spin 4s linear infinite' }}
             />
           </div>
        )}

        <motion.img 
            key={isOpen ? "open" : "closed"}
            src={isOpen ? "/images/items/music-box-open.png" : "/images/items/music-box-closed.png"} 
            alt="Müzik Kutusu" 
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className="w-full h-auto object-contain drop-shadow-xl relative z-20"
        />
      </InteractiveItem>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MusicBox;