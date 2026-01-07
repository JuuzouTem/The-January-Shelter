'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { useGame } from '@/context/GameContext';
import { quotes } from '@/data/quotes';

// Bileşenler
import TeaCup from './TeaCup';
import PlantGlitch from './PlantGlitch';
import RadioPlayer from './RadioPlayer';
import OwlAnim from './OwlAnim';
import InteractiveItem from './InteractiveItem';
import BookQuotes from '../UI/BookQuotes';
import PolaroidGallery from './PolaroidGallery';

const RoomScene = () => {
  const { changeScene, isCakeUnlocked } = useGame(); // isCakeUnlocked eklendi
  
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  // Rüzgar Sesi
  useEffect(() => {
    const windSound = new Howl({
      src: ['/sounds/wind.mp3'],
      loop: true,
      volume: 0.15,
      autoplay: true,
      html5: true
    });
    return () => { windSound.unload(); };
  }, []);

  const handleOpenBook = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setIsQuoteOpen(true);
  };

  const handleCakeClick = () => {
     // Pasta tıklandığında ne olacağı buraya gelecek (şu an boş)
     console.log("Pasta tıklandı!");
  };

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img 
        src="/images/room-bg.png" 
        alt="Room Background" 
        className="absolute inset-0 w-full h-full object-fill -z-50 opacity-90"
      />

      {/* --- EŞYALAR --- */}

      {/* Fotoğraf Galerisi */}
      <div className="absolute top-[38%] right-[14%] z-10 w-auto">
        <div className="scale-10 origin-top-right">
         <PolaroidGallery />
          </div>
      </div>

      {/* Bitki */}
      <motion.div className="absolute top-[10%] left-[29%] z-20 w-[20vw] max-w-[150px] origin-top"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} >
         <PlantGlitch />
      </motion.div>

      {/* Radyo */}
      <div className="absolute bottom-[44.2%] left-[52%] z-20 w-[3vw] max-w-[180px]">
         <RadioPlayer />
      </div>

      {/* Çay */}
      <div className="absolute bottom-[30%] left-[34.5%] z-20 w-[3vw] max-w-[100px]">
         <TeaCup />
      </div>

      {/* --- PASTA (YENİ EKLENEN KISIM) --- */}
      {isCakeUnlocked && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="absolute bottom-[32%] left-[42%] z-25 w-[8vw] max-w-[160px]"
        >
            <InteractiveItem 
                label="Doğum Günü" 
                onClick={handleCakeClick}
                className="w-full h-full"
            >
                <img 
                    src="/images/items/cake.png" 
                    alt="Birthday Cake" 
                    className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:scale-105 transition-transform duration-300"
                />
            </InteractiveItem>
        </motion.div>
      )}

      {/* Kitap */}
      <div className="absolute bottom-[6.4%] right-[18%] z-20 w-[12vw] max-w-[150px]">
        <InteractiveItem label="Notlar" onClick={handleOpenBook} className="w-full h-full">
            <img 
              src="/images/items/book.png" 
              alt="Kitap" 
              className="w-full h-auto object-contain -hover:rotate-0 transition-transform duration-500 drop-shadow-2xl"
            />
        </InteractiveItem>
      </div>

      {/* Baykuş */}
      <div className="absolute top-[26%] right-[10%] z-20 w-[8vw] max-w-[100px]">
         <OwlAnim />
      </div>

      {/* Teleskop */}
      <div className="absolute bottom-[-1%] right-[-4%] z-20 w-[20vw] max-w-[350px]">
        <InteractiveItem 
            label="Gökyüzü" 
            onClick={() => changeScene('sky')}
            className="w-full h-full"
          >
            <img
              src="/images/items/telescope.png"
              alt="Teleskop"
              className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </InteractiveItem>
      </div>

      {/* Atmosfer */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,#000000_100%)] z-30 opacity-50" />

      {/* Modallar */}
      <BookQuotes 
        isOpen={isQuoteOpen} 
        onClose={() => setIsQuoteOpen(false)} 
        quote={currentQuote} 
      />
    </motion.div>
  );
};

export default RoomScene;