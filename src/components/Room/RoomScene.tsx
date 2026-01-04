'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Telescope } from 'lucide-react';
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
  const { changeScene } = useGame();
  
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

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 
          1. ARKA PLAN (GARANTİ YÖNTEM: IMG TAGI) 
          Standart img tagı kullanıyoruz, z-index en altta.
      */}
      <img 
        src="/images/room-bg.png" 
        alt="Room Background" 
        className="absolute inset-0 w-full h-full object-cover -z-50 opacity-90"
      />

      {/* 
          2. EŞYALAR 
          Ağaç ev görseline göre konumlandırıldı.
      */}

      {/* Fotoğraf Galerisi (Üst Orta - Tavandan sarkıyor) */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
         <PolaroidGallery />
      </div>

      {/* Bitki (Sol Üst Köşe - Tavandan sarkıyor) */}
      <div className="absolute top-[-2%] left-[2%] z-20 w-[12vw] max-w-[150px]">
         <PlantGlitch />
      </div>

      {/* Radyo (Sol Alt Köşe - Yerde/Rafta) */}
      <div className="absolute bottom-[5%] left-[5%] z-20 w-[15vw] max-w-[180px]">
         <RadioPlayer />
      </div>

      {/* Çay (Orta Alt - Halı/Masa üstü) */}
      <div className="absolute bottom-[10%] left-[35%] z-20 w-[8vw] max-w-[100px]">
         <TeaCup />
      </div>

      {/* Kitap (Sağ Alt - Yerde/Rafta) */}
      <div className="absolute bottom-[5%] right-[25%] z-20 w-[12vw] max-w-[160px]">
        <InteractiveItem label="Notlar" onClick={handleOpenBook} className="w-full h-full">
            <img 
              src="/images/items/book.png" 
              alt="Kitap" 
              className="w-full h-auto object-contain -rotate-6 hover:rotate-0 transition-transform duration-500 drop-shadow-2xl"
            />
        </InteractiveItem>
      </div>

      {/* Baykuş (Sağ Üst - Pencere kenarı) */}
      <div className="absolute top-[25%] right-[10%] z-20 w-[10vw] max-w-[120px]">
         <OwlAnim />
      </div>

      {/* Teleskop (Sağ Alt - Pencere önü) */}
      <div className="absolute bottom-[15%] right-[5%] z-20 w-[10vw] max-w-[120px]">
        <InteractiveItem 
            label="Gökyüzü" 
            onClick={() => changeScene('sky')}
            className="w-full h-full"
          >
            <Telescope className="w-full h-full text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] -rotate-45 hover:text-yellow-200 transition-colors" />
          </InteractiveItem>
      </div>

      {/* 3. ATMOSFER KATMANLARI */}
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