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

  // 1. Sesi Yükle
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

  // 2. DÜZELTİLMİŞ SES KONTROL MANTIĞI
  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;

    // ÖNEMLİ: Önceki render'dan kalan 'fade' olay dinleyicilerini temizle.
    // Bu, hızlı aç-kapa yapıldığında eski kapatma komutunun yeni açılışı bozmasını engeller.
    sound.off('fade');

    if (isOpen) {
        // Yeni bir ses başlatmadan önce, bu Howl instance'ına ait TÜM sesleri durdur.
        // Bu, seslerin üst üste binmesini (stacking) kesin olarak engeller.
        sound.stop();
        
        const id = sound.play();
        soundIdRef.current = id;
        // Sesi 0'dan 0.4'e 1 saniyede çıkar
        sound.fade(0, 0.4, 1000, id);

    } else {
        const id = soundIdRef.current;
        if (id && sound.playing(id)) {
            // Şu anki ses seviyesini al (yumuşak geçiş için)
            const currentVol = sound.volume(id) as number || sound.volume();
            
            // Sesi mevcut seviyeden 0'a 0.5 saniyede indir
            sound.fade(currentVol, 0, 500, id);
            
            // Fade bittiğinde sesi tamamen durdur
            sound.once('fade', () => {
                sound.stop(id);
                soundIdRef.current = null;
            }, id);
        } else {
            // Eğer zaten çalmıyorsa güvenli durdurma
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
        
        {/* --- BALERİN KISMI --- */}
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

        {/* Kutu Görseli */}
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