'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import Confetti from 'react-confetti'; // Konfeti eklendi
import useWindowSize from 'react-use/lib/useWindowSize'; // Boyutlandırma için
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
import BirthdayModal from '../UI/BirthdayModal'; // Yeni modal import edildi

const RoomScene = () => {
  const windSoundRef = useRef<Howl | null>(null);
  const { changeScene, isCakeUnlocked } = useGame();
  const { width, height } = useWindowSize(); // Konfeti için ekran boyutu
  
  // Modallar için State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [currentQuote, setCurrentQuote] = useState("");

  // Rüzgar Sesi
  useEffect(() => {
    windSoundRef.current = new Howl({
      src: ['/sounds/wind.mp3'],
      loop: true,
      volume: 0.15,
      autoplay: true,
      html5: true
    });

    return () => { 
      // Temizlik yaparken ref üzerinden unload ediyoruz
      if (windSoundRef.current) {
        windSoundRef.current.unload();
      }
    };
  }, []);

  const handleRadioStateChange = (isRadioPlaying: boolean) => {
    if (!windSoundRef.current) return;

    if (isRadioPlaying) {
      // Radyo çalıyor: Rüzgarı 1 saniye içinde 0'a (veya 0.02 gibi çok kısıma) indir
      windSoundRef.current.fade(windSoundRef.current.volume(), 0.0, 1000);
    } else {
      // Radyo durdu: Rüzgarı 1 saniye içinde tekrar 0.15'e çıkar
      windSoundRef.current.fade(windSoundRef.current.volume(), 0.15, 1000);
    }
  };

  const handleOpenBook = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setIsQuoteOpen(true);
  };

  // --- PASTA TIKLAMA OLAYI ---
  const handleCakeClick = () => {
     // 1. Sesi Çal
     const yaySound = new Howl({
        src: ['/sounds/yey.mp3'],
        volume: 0.6
     });
     yaySound.play();

     // 2. Konfetiyi Patlat
     setShowConfetti(true);

     // 3. Modalı Aç (Biraz gecikmeli açılabilir ki konfeti görünsün)
     setTimeout(() => {
        setIsBirthdayModalOpen(true);
     }, 500);
     
     // 4. Konfetiyi 5 saniye sonra durdur (Performans için)
     setTimeout(() => {
        setShowConfetti(false);
     }, 6000);
  };

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* KONFETİ KATMANI (En üstte görünmesi için z-index yüksek olmalı) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[99]">
            <Confetti width={width} height={height} numberOfPieces={300} recycle={true} />
        </div>
      )}

      {/* ARKA PLAN */}
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
         <RadioPlayer onPlayStateChange={handleRadioStateChange} />
      </div>

      {/* Çay */}
      <div className="absolute bottom-[30%] left-[34.5%] z-20 w-[3vw] max-w-[100px]">
         <TeaCup />
      </div>

      {/* --- PASTA --- */}
      {isCakeUnlocked && (
        <motion.div 
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-[21%] left-[40%] z-25 w-[12vw] max-w-[360px] cursor-pointer"
        >
            <InteractiveItem 
                label="Doğum Günü" 
                onClick={handleCakeClick}
                className="w-full h-full"
            >
                <img 
                    src="/images/items/cake.png" 
                    alt="Birthday Cake" 
                    className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
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

      {/* --- MODALLAR --- */}
      
      {/* Kitap Sözleri Modalı */}
      <BookQuotes 
        isOpen={isQuoteOpen} 
        onClose={() => setIsQuoteOpen(false)} 
        quote={currentQuote} 
      />

      {/* YENİ: Doğum Günü Mektup Modalı */}
      <AnimatePresence>
        {isBirthdayModalOpen && (
            <BirthdayModal 
                isOpen={isBirthdayModalOpen} 
                onClose={() => setIsBirthdayModalOpen(false)} 
            />
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default RoomScene;