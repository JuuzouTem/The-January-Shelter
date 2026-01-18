'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { useGame } from '@/context/GameContext';
import { quotes } from '@/data/quotes';
import Image from 'next/image';

import TeaCup from './TeaCup';
import PlantGlitch from './PlantGlitch';
import RadioPlayer, { RadioPlayerHandle } from './RadioPlayer';
import OwlAnim from './OwlAnim';
import InteractiveItem from './InteractiveItem';
import BookQuotes from '../UI/BookQuotes';
import PolaroidGallery from './PolaroidGallery';
import BirthdayModal from '../UI/BirthdayModal';

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

  const [isMoonLit, setIsMoonLit] = useState(isCakeUnlocked); 
  
  const [isMusicBoxPlaying, setIsMusicBoxPlaying] = useState(false);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);

  const updateWindVolume = useCallback(() => {
    if (!windSoundRef.current || windIdRef.current === null) return;

    const sound = windSoundRef.current;
    const soundId = windIdRef.current;
    const currentVol = sound.volume();

    if (isRadioPlaying || isMusicBoxPlaying) {
      sound.fade(currentVol, 0, 1000, soundId);
    } else {
      sound.fade(currentVol, 0.15, 1000, soundId);
    }
  }, [isRadioPlaying, isMusicBoxPlaying]);

  useEffect(() => {
    updateWindVolume();
  }, [updateWindVolume]);


  useEffect(() => {
    if (isCakeUnlocked) {
      setIsMoonLit(true);

      const timer = setTimeout(() => {
        if (radioRef.current) {
            radioRef.current.playSpecificSong(11);
        }
      }, 500);
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

  const handleRadioStateChange = useCallback((playing: boolean) => {
    setIsRadioPlaying(playing);
  }, []);

  const handleMusicBoxStateChange = useCallback((isOpen: boolean) => {
    setIsMusicBoxPlaying(isOpen);
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
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
        style={{
            backgroundColor: isMoonLit ? 'rgba(10, 20, 60, 0.6)' : 'transparent',
            mixBlendMode: 'multiply', 
        }}
      />
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

      <div className="absolute inset-0 -z-50 w-full h-full">
         <Image 
            src="/images/room-bg.png" 
            alt="Room Background" 
            fill
            priority={true}
            quality={100}
            className="object-fill opacity-90 transition-all duration-1000"
            style={{
                filter: isMoonLit ? 'brightness(0.6) grayscale(0.2)' : 'brightness(1) grayscale(0)'
            }}
         />
      </div>

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

      <div className="absolute bottom-[44.2%] left-[52%] z-21 w-[3vw] max-w-[180px]">
         <RadioPlayer ref={radioRef} onPlayStateChange={handleRadioStateChange} />
      </div>

      <div className="absolute bottom-[44.2%] left-[18.3%] z-20 w-[4vw] max-w-[120px]">
         <MusicBox onStateChange={handleMusicBoxStateChange} />
      </div>

      <div className="absolute bottom-[30%] left-[34.5%] z-20 w-[3vw] max-w-[100px]">
         <TeaCup />
      </div>

      {isCakeUnlocked && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-[21%] left-[40%] z-20 w-[12vw] max-w-[360px] cursor-pointer"
        >
            <InteractiveItem label="Doğum Günü" onClick={handleCakeClick} className="w-full h-full">
                <img src="/images/items/cake.png" alt="Birthday Cake" className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]" />
            </InteractiveItem>
        </motion.div>
      )}

      <div className="absolute bottom-[6.4%] right-[18%] z-20 w-[11vw] max-w-[150px]">
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