'use client';

import React, { useState, useEffect } from 'react'; // useEffect eklendi
import { motion } from 'framer-motion';
import { Telescope } from 'lucide-react';
import { Howl } from 'howler'; // Howler eklendi
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

  // --- RÜZGAR SESİ ENTEGRASYONU ---
  useEffect(() => {
    // Oda açılınca rüzgar başlasın
    const windSound = new Howl({
      src: ['/sounds/wind.mp3'],
      loop: true,       // Sürekli çalsın
      volume: 0.15,     // Çok kısık, rahatsız etmeyen seviye
      autoplay: true,
      html5: true
    });

    // Oda kapanırsa (Gökyüzüne gidilirse) ses dursun
    return () => {
      windSound.unload();
    };
  }, []);
  // ---------------------------------

  const handleOpenBook = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setIsQuoteOpen(true);
  };

  return (
    <motion.div 
      className="relative w-full h-full max-w-6xl mx-auto flex items-end justify-center perspective-1000"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* --- ODA ALTYAPISI --- */}
      <div className="absolute inset-0 bg-[#1a1f2e] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] rounded-t-[50px] border-t-8 border-[#2d3748] overflow-hidden">
        
        {/* Fotoğraf Galerisi */}
        <PolaroidGallery />

        {/* Pencere */}
        <div className="absolute top-20 md:top-10 left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-80 bg-[#0a0f1e]/30 border-8 border-[#4a5568] rounded-t-full shadow-2xl backdrop-blur-[2px] z-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-4 bg-[#4a5568]"></div>
            <div className="absolute h-full w-4 bg-[#4a5568]"></div>
          </div>
        </div>

        {/* Zemin */}
        <div className="absolute bottom-0 w-full h-1/3 bg-[#2d2a24] border-t-4 border-[#3f3b32] shadow-2xl z-10">
           <div className="w-full h-full opacity-10 bg-[radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%,transparent),radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%,transparent)] bg-[length:20px_20px]" />
        </div>
      </div>

      {/* --- EŞYALAR --- */}
      <div className="relative z-20 w-full h-1/3 flex items-end justify-around pb-10 px-4 md:px-20">
        
        {/* Sol Taraf */}
        <div className="flex flex-col items-center gap-6 mb-4">
           <PlantGlitch />
           <RadioPlayer />
        </div>

        {/* Orta */}
        <div className="flex items-end gap-8 mb-4">
          <TeaCup />
          
          {/* Kitap */}
          <InteractiveItem label="Rastgele Bir Not" onClick={handleOpenBook} className="w-20 h-20">
             <img 
               src="/images/items/book.png" 
               alt="Kitap" 
               className="w-full h-full object-contain -rotate-12 drop-shadow-lg"
             />
          </InteractiveItem>
        </div>

        {/* Sağ Taraf */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <OwlAnim />

          <InteractiveItem 
            label="Gökyüzüne Bak" 
            onClick={() => changeScene('sky')}
            className="w-24 h-24"
          >
            <Telescope size={80} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] -rotate-45" />
          </InteractiveItem>
        </div>
      </div>

      {/* Vignette (Karanlık Kenarlar) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0a0f1e_100%)] z-30" />

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