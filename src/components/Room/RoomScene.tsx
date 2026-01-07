'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
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
import BirthdayModal from '../UI/BirthdayModal';

const RoomScene = () => {
  // Sesi ve ID'sini tutacak referanslar
  const windSoundRef = useRef<Howl | null>(null);
  const windIdRef = useRef<number | null>(null);

  const { changeScene, isCakeUnlocked } = useGame();
  const { width, height } = useWindowSize();
  
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  // --- RÜZGAR SESİ BAŞLATMA (DÜZELTİLMİŞ HALİ) ---
  useEffect(() => {
    // 1. Sesi yerel bir değişkene atıyoruz (Strict Mode fix)
    const sound = new Howl({
      src: ['/sounds/wind.mp3'],
      loop: true,
      volume: 0.15,
      autoplay: false,
      html5: true
    });

    // 2. Referansımızı güncelliyoruz (Diğer fonksiyonlar erişebilsin diye)
    windSoundRef.current = sound;

    // 3. Sesi başlatıp ID'sini alıyoruz
    const id = sound.play();
    windIdRef.current = id;

    console.log("🔊 Rüzgar başlatıldı. Instance ID:", id);

    // 4. TEMİZLİK (EN ÖNEMLİ KISIM)
    return () => {
      console.log("🛑 Temizlik yapılıyor. Kapatılan ID:", id);
      // Burada ref.current yerine direkt 'sound' değişkenini kullanıyoruz.
      // Bu sayede "hayalet ses" kalması imkansız hale gelir.
      sound.stop();
      sound.unload();
    };
  }, []);

  // --- RADYO DURUMUNU DİNLEYEN FONKSİYON ---
  const handleRadioStateChange = useCallback((isRadioPlaying: boolean) => {
    // Ref'ler boşsa işlem yapma
    if (!windSoundRef.current || windIdRef.current === null) return;

    const sound = windSoundRef.current;
    const soundId = windIdRef.current;
    const currentVol = sound.volume();

    console.log(`Radyo: ${isRadioPlaying ? 'ÇALIYOR' : 'DURDU'} - Rüzgar müdahalesi yapılıyor.`);

    if (isRadioPlaying) {
      // Radyo çalıyor: Sesi mevcut seviyesinden 0'a indir
      sound.fade(currentVol, 0, 1000, soundId);
    } else {
      // Radyo durdu: Sesi mevcut seviyesinden 0.15'e çıkar
      sound.fade(currentVol, 0.15, 1000, soundId);
    }
  }, []);

  // --- DİĞER FONKSİYONLAR ---
  const handleOpenBook = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setIsQuoteOpen(true);
  };

  const handleCakeClick = () => {
     const yaySound = new Howl({ src: ['/sounds/yey.mp3'], volume: 0.6 });
     yaySound.play();
     setShowConfetti(true);
     setTimeout(() => { setIsBirthdayModalOpen(true); }, 500);
     setTimeout(() => { setShowConfetti(false); }, 6000);
  };

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[99]">
            <Confetti width={width} height={height} numberOfPieces={300} recycle={true} />
        </div>
      )}

      <img src="/images/room-bg.png" alt="Room Background" className="absolute inset-0 w-full h-full object-fill -z-50 opacity-90" />

      {/* --- EŞYALAR --- */}
      <div className="absolute top-[38%] right-[14%] z-10 w-auto">
        <div className="scale-10 origin-top-right"><PolaroidGallery /></div>
      </div>

      <motion.div className="absolute top-[10%] left-[29%] z-20 w-[20vw] max-w-[150px] origin-top"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
         <PlantGlitch />
      </motion.div>

      {/* RADYO: Prop'u geçiyoruz */}
      <div className="absolute bottom-[44.2%] left-[52%] z-20 w-[3vw] max-w-[180px]">
         <RadioPlayer onPlayStateChange={handleRadioStateChange} />
      </div>

      <div className="absolute bottom-[30%] left-[34.5%] z-20 w-[3vw] max-w-[100px]">
         <TeaCup />
      </div>

      {isCakeUnlocked && (
        <motion.div 
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-[21%] left-[40%] z-25 w-[12vw] max-w-[360px] cursor-pointer"
        >
            <InteractiveItem label="Doğum Günü" onClick={handleCakeClick} className="w-full h-full">
                <img src="/images/items/cake.png" alt="Birthday Cake" className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
            </InteractiveItem>
        </motion.div>
      )}

      <div className="absolute bottom-[6.4%] right-[18%] z-20 w-[12vw] max-w-[150px]">
        <InteractiveItem label="Notlar" onClick={handleOpenBook} className="w-full h-full">
            <img src="/images/items/book.png" alt="Kitap" className="w-full h-auto object-contain -hover:rotate-0 transition-transform duration-500 drop-shadow-2xl" />
        </InteractiveItem>
      </div>

      <div className="absolute top-[26%] right-[10%] z-20 w-[8vw] max-w-[100px]">
         <OwlAnim />
      </div>

      <div className="absolute bottom-[-1%] right-[-4%] z-20 w-[20vw] max-w-[350px]">
        <InteractiveItem label="Gökyüzü" onClick={() => changeScene('sky')} className="w-full h-full">
            <img src="/images/items/telescope.png" alt="Teleskop" className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
          </InteractiveItem>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,#000000_100%)] z-30 opacity-50" />

      <BookQuotes isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} quote={currentQuote} />

      <AnimatePresence>
        {isBirthdayModalOpen && (
            <BirthdayModal isOpen={isBirthdayModalOpen} onClose={() => setIsBirthdayModalOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoomScene;