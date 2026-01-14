'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { useGame } from '@/context/GameContext';
import { quotes } from '@/data/quotes';

// Mevcut Bileşenler
import TeaCup from './TeaCup';
import PlantGlitch from './PlantGlitch';
import RadioPlayer, { RadioPlayerHandle } from './RadioPlayer';
import OwlAnim from './OwlAnim';
import InteractiveItem from './InteractiveItem';
import BookQuotes from '../UI/BookQuotes';
import PolaroidGallery from './PolaroidGallery';
import BirthdayModal from '../UI/BirthdayModal';

// YENİ BİLEŞENLER
import MusicBox from './MusicBox';
import MoonGarland from './MoonGarland';

const RoomScene = () => {
  const windSoundRef = useRef<Howl | null>(null);
  const windIdRef = useRef<number | null>(null);
  
  const radioRef = useRef<RadioPlayerHandle>(null);

  const { changeScene, isCakeUnlocked } = useGame();
  const { width, height } = useWindowSize();
  
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  // --- YENİ STATE'LER ---
  const [isMoonLit, setIsMoonLit] = useState(false); // Gece Modu / Işık
  const [isMusicBoxPlaying, setIsMusicBoxPlaying] = useState(false); // Müzik Kutusu Sesi
  const [isRadioPlaying, setIsRadioPlaying] = useState(false); // Radyo Sesi Takibi

  // --- SES MANTIĞI (GÜNCELLENDİ) ---
  // Rüzgar sesi, Radyo VEYA Müzik kutusu çalıyorsa kısılmalı.
  const updateWindVolume = useCallback(() => {
    if (!windSoundRef.current || windIdRef.current === null) return;

    const sound = windSoundRef.current;
    const soundId = windIdRef.current;
    const currentVol = sound.volume();

    // Eğer Radyo VEYA Müzik Kutusu açıksa rüzgarı sustur (fade out)
    if (isRadioPlaying || isMusicBoxPlaying) {
      sound.fade(currentVol, 0, 1000, soundId);
    } else {
      // İkisi de kapalıysa rüzgarı geri getir (fade in)
      sound.fade(currentVol, 0.15, 1000, soundId);
    }
  }, [isRadioPlaying, isMusicBoxPlaying]);

  // isRadioPlaying veya isMusicBoxPlaying değiştiğinde sesi güncelle
  useEffect(() => {
    updateWindVolume();
  }, [updateWindVolume]);


  // Başlangıç ve Rüzgar Sesi Kurulumu
  useEffect(() => {
    if (isCakeUnlocked) {
      const timer = setTimeout(() => {
        if (radioRef.current) {
            radioRef.current.playSpecificSong(11);
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    const sound = new Howl({
      src: ['/sounds/wind.mp3'],
      loop: true,
      volume: 0.05,
      autoplay: false,
      html5: true
    });

    windSoundRef.current = sound;
    const id = sound.play();
    windIdRef.current = id;

    return () => {
      sound.stop();
      sound.unload();
    };
  }, [isCakeUnlocked]);

  // Radyo Callback Güncellemesi
  const handleRadioStateChange = useCallback((playing: boolean) => {
    setIsRadioPlaying(playing);
    // updateWindVolume useEffect tarafından tetiklenecek
  }, []);

  // Müzik Kutusu Callback
  const handleMusicBoxStateChange = useCallback((isOpen: boolean) => {
    setIsMusicBoxPlaying(isOpen);
    // updateWindVolume useEffect tarafından tetiklenecek
  }, []);

  const handleOpenBook = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setIsQuoteOpen(true);
  };

  const handleCakeClick = () => {
     const yaySound = new Howl({ src: ['/sounds/yey.mp3'], volume: 0.5 });
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
      // Gece modunda arka plan rengini koyulaştır (Overlay yetmezse diye fallback)
    >
      {/* --- GECE MODU / LIGHTING OVERLAY --- */}
      {/* Bu div arkaplanın üzerindedir ancak interaktif itemlerin altındadır (z-index 10-15 arası) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
        style={{
            backgroundColor: isMoonLit ? 'rgba(10, 20, 60, 0.6)' : 'transparent',
            mixBlendMode: 'multiply', // Resmi karartır ve mavi ton katar
        }}
      />
      {/* İkinci bir katman: Hafif bir parlaklık efekti (Soft Light) */}
       <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-10"
        style={{
            backgroundColor: isMoonLit ? 'rgba(20, 30, 80, 0.2)' : 'transparent',
            mixBlendMode: 'overlay', 
        }}
      />

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[99]">
            <Confetti width={width} height={height} numberOfPieces={300} recycle={true} />
        </div>
      )}

      {/* Arka Plan Resmi */}
      <img 
        src="/images/room-bg.png" 
        alt="Room Background" 
        className="absolute inset-0 w-full h-full object-fill -z-50 opacity-90 transition-all duration-1000"
        style={{
            // Gece modunda resmi biraz grileştirip parlaklığını kısıyoruz.
            // Bu sayede mavi overlay daha iyi görünüyor ve renkler patlamıyor.
            filter: isMoonLit ? 'brightness(0.6) grayscale(0.2)' : 'brightness(1) grayscale(0)'
        }}
      />

      {/* --- YENİ: AY GARLANDI --- */}
      <div className="absolute top-[16%] left-[19%] w-[70vw] max-w-[1300px] z-40 h-[100px]">
         <MoonGarland isLit={isMoonLit} onToggleMood={() => setIsMoonLit(!isMoonLit)} />
      </div>

      <div className="absolute top-[38%] right-[14%] z-20 w-auto">
        <div className="scale-10 origin-top-right"><PolaroidGallery /></div>
      </div>

      <motion.div className="absolute top-[10%] left-[29%] z-41 w-[20vw] max-w-[150px] origin-top"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
         <PlantGlitch />
      </motion.div>

      {/* Radyo (z-index itemlerin üstünde olmalı, overlay'in de üstünde: z-20) */}
      <div className="absolute bottom-[44.2%] left-[52%] z-21 w-[3vw] max-w-[180px]">
         <RadioPlayer ref={radioRef} onPlayStateChange={handleRadioStateChange} />
      </div>

      {/* --- YENİ: MÜZİK KUTUSU --- */}
      {/* Konumlandırma: Masa üzerinde veya rafta. Şimdilik sağ alt tarafa kitapların yakınına koyuyorum */}
      <div className="absolute bottom-[44.2%] left-[18.3%] z-20 w-[4vw] max-w-[120px]">
         <MusicBox onStateChange={handleMusicBoxStateChange} />
      </div>

      <div className="absolute bottom-[30%] left-[34.5%] z-20 w-[3vw] max-w-[100px]">
         <TeaCup />
      </div>

      {isCakeUnlocked && (
        <motion.div 
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-[21%] left-[40%] z-20 w-[12vw] max-w-[360px] cursor-pointer"
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

      {/* Eski Vignette Efekti (Hala durabilir, overlay ile karışır) */}
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