'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EmptyBookProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
}

const TOTAL_PAGES = 10;

// Renk Listesi (Sağ Sayfadaki Eşyalar)
const RECT_COLORS = [
  '#E57373', '#64B5F6', '#81C784', '#FFD54F', 
  '#BA68C8', '#4DD0E1', '#F06292', '#FF8A65', '#A1887F'
];

// Sol Sayfadaki Başlıklar (Çerçevesiz Yazılar)
const LEFT_PAGE_TITLES = [
  { title: "Bölüm I", subtitle: "Rüzgarın Sesi" },
  { title: "Bölüm II", subtitle: "Yıldızlı Gece" },
  { title: "Bölüm III", subtitle: "Eski Bir Rüya" },
  { title: "Bölüm IV", subtitle: "Sabah Kahvesi" },
  { title: "Bölüm V", subtitle: "Sonbahar Yaprağı" },
  { title: "Bölüm VI", subtitle: "Unutulmaz Melodi" },
  { title: "Bölüm VII", subtitle: "Yağmur Sesi" },
  { title: "Bölüm VIII", subtitle: "Deniz Feneri" },
  { title: "Bölüm IX", subtitle: "Sessiz An" },
];

// Sağ Sayfadaki Gizli Yazılar
const MEMORY_TEXTS = [
  "Bugün hava beklenmedik şekilde serindi. Rüzgarın sesini dinlerken, eski günlerin sıcaklığını hatırladım. Zaman ne çabuk geçiyor...",
  "Gökyüzü bu gece yıldızlarla doluydu. Sanki hepsi bana göz kırpıyordu. Bir dilek tuttum ve rüzgara bıraktım.",
  "Eski bir dostla karşılaştım rüyamda. Hiç konuşmadık ama bakışlarımızla saatlerce sohbet ettik. Uyandığımda gülümsüyordum.",
  "Kahvenin kokusu odayı sardığında, huzurun ne kadar basit bir şey olduğunu fark ettim. Mutluluk küçük anlarda saklı.",
  "Yürüyüş yaparken bulduğum o yaprak, sonbaharın son hediyesiydi. Rengi tıpkı güneşin batışı gibi turuncuydu.",
  "Müzik ruhun gıdasıdır derler, bugün dinlediğim o melodi beni yıllar öncesine götürdü. Hâlâ kulaklarımda çınlıyor.",
  "Yağmurun cama vuran ritmi, doğanın en güzel ninnisi. Bu sesi dinleyerek uykuya dalmak gibisi yok.",
  "Bir kitapta okuduğum cümle aklımdan çıkmıyor: 'Anılar, zamanın içindeki deniz fenerleridir.' Ne kadar da doğru.",
  "Bugün kendim için bir şey yaptım ve sadece durdum. Hiçbir şey yapmadan, sadece nefes alarak anın tadını çıkardım."
];

const EmptyBook = ({ isOpen, onClose, quote }: EmptyBookProps) => {
  const [flippedIndex, setFlippedIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (activeItemIndex !== null) return;
    if (flippedIndex < TOTAL_PAGES) {
      setFlippedIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeItemIndex !== null) return;
    if (flippedIndex > 0) {
      setFlippedIndex((prev) => prev - 1);
    }
  };

  const handleItemClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveItemIndex(index);
  };

  const closeActiveItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveItemIndex(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          
          {/* --- AKTİF EŞYA KATMANI --- */}
          <AnimatePresence>
            {activeItemIndex !== null && (
              <motion.div 
                className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
                initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
                onClick={closeActiveItem}
              >
                <motion.div
                  drag
                  dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
                  dragElastic={0.2}
                  whileDrag={{ scale: 2.1, cursor: 'grabbing' }}
                  className="relative shadow-2xl rounded-sm flex items-center justify-center cursor-grab"
                  style={{ 
                    width: 140, 
                    height: 200, 
                    backgroundColor: RECT_COLORS[(activeItemIndex - 1) % RECT_COLORS.length],
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.1%22/%3E%3C/svg%3E")',
                  }}
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ 
                    scale: 2, 
                    opacity: 1,
                    y: 0,
                    rotate: -90, 
                    zIndex: 201
                  }}
                  exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={closeActiveItem}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute w-10 h-10 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-xl border-2 border-gray-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors z-[250]"
                        style={{ bottom: '-25px', right: '-25px', transform: 'rotate(90deg)' }} 
                    >
                        <X size={20} strokeWidth={3} />
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-[180px] h-[120px] flex items-center justify-center transform rotate-90">
                           <p 
                              className="text-sm font-serif leading-relaxed text-center"
                              style={{ 
                                fontFamily: '"Dancing Script", cursive, serif',
                                color: '#1a237e',
                                opacity: 0.85,
                                mixBlendMode: 'multiply',
                                textShadow: '0 0 1px rgba(26, 35, 126, 0.1)'
                              }}
                           >
                             "{MEMORY_TEXTS[(activeItemIndex - 1) % MEMORY_TEXTS.length]}"
                           </p>
                           <span className="absolute bottom-0 right-0 text-[8px] transform" style={{ fontFamily: '"Dancing Script", cursive', color: '#1a237e', opacity: 0.6 }}>~ 14.01.25</span>
                        </div>
                    </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* --- KİTAP SAHNESİ --- */}
          <motion.div
            drag={activeItemIndex === null}
            dragMomentum={false}
            whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className={`relative ${activeItemIndex === null ? 'cursor-grab' : ''}`}
            style={{ perspective: '1500px' }}
          >
            
            {activeItemIndex === null && (
                <button 
                onClick={onClose} 
                className="absolute -top-12 right-0 z-50 bg-white/20 hover:bg-red-500/80 text-white rounded-full p-2 transition-all duration-300 backdrop-blur-md"
                >
                <X size={24} />
                </button>
            )}

            <div className="relative w-[600px] h-[450px]" style={{ transformStyle: 'preserve-3d' }}>
              
              <div 
                className="absolute right-0 top-0 w-[300px] h-full rounded-r-lg shadow-2xl bg-[#3e2723]"
                style={{ 
                  transform: 'translateZ(-2px)',
                  backgroundImage: "url('/images/paper-texture.jpg')",
                  backgroundBlendMode: 'multiply'
                }}
              />

              {Array.from({ length: TOTAL_PAGES }).map((_, index) => {
                const isFlipped = index < flippedIndex;
                const isCover = index === 0;
                
                // Sağ sayfa rengi
                const rectColor = !isCover ? RECT_COLORS[(index - 1) % RECT_COLORS.length] : null;
                
                // Sol sayfa yazısı (Bir sonraki sayfanın soluna denk gelir)
                const leftPageContent = index < TOTAL_PAGES - 1 ? LEFT_PAGE_TITLES[index] : null;

                let zIndex = 0;
                if (isFlipped) {
                  zIndex = index;
                } else {
                  zIndex = TOTAL_PAGES - index;
                }

                return (
                  <motion.div
                    key={index}
                    className="absolute right-0 top-0 w-[300px] h-full origin-left rounded-r-lg shadow-md cursor-pointer"
                    style={{
                      zIndex: zIndex,
                      transformStyle: 'preserve-3d',
                      backgroundColor: isCover ? '#5d4037' : '#fdf6e3',
                      backgroundImage: "url('/images/paper-texture.jpg')",
                      backgroundBlendMode: isCover ? 'overlay' : 'normal',
                      backgroundSize: 'cover',
                      borderLeft: isCover ? '4px solid #3e2723' : '1px solid rgba(0,0,0,0.1)'
                    }}
                    animate={{ 
                      rotateY: isFlipped ? -180 : 0 
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeInOut" 
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFlipped) {
                        if (index === flippedIndex - 1) handlePrev();
                      } else {
                        if (index === flippedIndex) handleNext();
                      }
                    }}
                  >
                    {/* --- ÖN YÜZ (Sağ Sayfa) --- */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-r-lg overflow-hidden flex flex-col items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {/* KAPAK */}
                      {isCover && (
                        <div className="flex flex-col items-center justify-center select-none p-4">
                            <h1 className="text-5xl font-serif text-[#e0c097] drop-shadow-lg tracking-[0.2em] opacity-90">ANILAR</h1>
                            <div className="w-12 h-0.5 bg-[#e0c097]/40 my-4 rounded-full" />
                            <span className="text-[10px] text-[#e0c097]/60 tracking-[0.4em] uppercase">KOLEKSİYONU</span>
                        </div>
                      )}

                      {/* İÇ SAYFA (SAĞ) */}
                      {!isCover && rectColor && (
                        <div className="flex items-center justify-center w-full h-full p-8">
                          <div 
                            className="w-[140px] h-[200px] shadow-inner rounded-sm cursor-pointer hover:scale-105 transition-transform"
                            style={{ 
                              backgroundColor: rectColor,
                              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 2px 4px 6px rgba(0,0,0,0.2)'
                            }}
                            onClick={(e) => handleItemClick(e, index)}
                          >
                             <div className="w-full h-full flex items-center justify-center opacity-20">
                                <span className="text-white text-4xl font-serif">?</span>
                             </div>
                          </div>
                        </div>
                      )}

                      {!isCover && (
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {/* --- ARKA YÜZ (Sol Sayfa) --- */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-l-lg overflow-hidden flex items-center justify-center"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        backgroundColor: isCover ? '#fdf6e3' : 'transparent',
                        backgroundImage: "url('/images/paper-texture.jpg')"
                      }}
                    >
                      {/* SOL SAYFA İÇERİĞİ (Küçük çerçevesiz yazılar) */}
                      {leftPageContent && (
                        <div className="text-center p-8 opacity-80 select-none">
                            <h3 
                              className="text-xs tracking-[0.3em] text-[#5d4037] font-bold uppercase mb-2"
                              style={{ fontFamily: 'serif' }}
                            >
                              {leftPageContent.title}
                            </h3>
                            <div className="w-8 h-px bg-[#5d4037]/30 mx-auto mb-2"></div>
                            <p 
                              className="text-xl text-[#3e2723]"
                              style={{ fontFamily: '"Dancing Script", cursive' }}
                            >
                              {leftPageContent.subtitle}
                            </p>
                        </div>
                      )}

                      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmptyBook;