'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EmptyBookProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
}


const PAGES = [
  {
    id: 1,
    title: "Bölüm I",
    subtitle: "Sessiz Fısıltılar",
    color: '#D4C4FB',
    orientation: 'landscape',
    content: "Merak ediyorum, başımı kaldırıp geceye baktığımızda gözlerimiz aynı ayı mı buluyor?\nEğer öyleyse, ona fısıldadıklarını görebilmeyi, sessizliğinde sakladıklarını duyabilmeyi dilerdim..."
  },
  {
    id: 2,
    title: "Bölüm II",
    subtitle: "You or Country",
    color: '#E8D5B5',
    orientation: 'portrait',
    content: "- If I betray you, I betray myself.\n- If I betray him, I betray my country.\n- My country is very dear to me.\n+ Dearer than I?\n- No...\n- No. Not dearer than you."
  },
  {
    id: 3,
    title: "Bölüm III",
    subtitle: "Rüzgarın Taşıdıkları",
    color: '#FFABAB',
    orientation: 'landscape',
    content: "Rüzgar her estiğinde, getirdiği uğultuya kulak veriyor musun? Belki de kelimelere dökülemeyen, sana ulaşamayan o cümleleri taşıyordur kulaklarına..."
  },
  {
    id: 4,
    title: "Bölüm IV",
    subtitle: "The One Cold Star",
    color: '#AED9E0',
    orientation: 'portrait',
    content: "- You must tell her the truth. Before it's...\n- Before it's too late!\n+ Tell her the truth?\n+ Tell her the... truth so that she will watch the stars through tears?\n+ Instead of following the one cold star that is her destiny?\n+ No, no Elvar...\n+ Let her think, I never loved her..."
  },
  {
    id: 5,
    title: "Bölüm V",
    subtitle: "Parlayan Kuyruklu yıldız",
    color: '#B8E0D2',
    orientation: 'portrait',
    content: "- Oh Kevin, dediklerini duydun mu?\nGökyüzünde parıldayan bir kayan yıldızmışım onlar için. Sence ben bir parıltı kadar mıyım?\n+ Bırak gökyüzü onların olsun karanlığa gömüldüğünde siyaha bakan ben olacağım, yetmez mi?"
  },
  {
    id: 6,
    title: "Bölüm VI",
    subtitle: "Foolish Reason",
    color: '#FFF5BA',
    orientation: 'portrait',
    content: "- Once I told you \"I'd kissed a thousand women\" it was a lie.\n+ I know\n- I've only kissed two or three hundred.\n- Now, how many men have you kissed?\n+ Very few.\n- But you offered me a kiss, why?\n+ Such a foolish reason I'm afraid.\n+ I just... wanted to kiss you."
  },
  {
    id: 7,
    title: "Bölüm VII",
    subtitle: "Anlamak",
    color: '#D7CCC8',
    orientation: 'landscape',
    content: "Bir benle karşılaştım rüyamda,\nTek bir kelime etmedik.\nSüzüp gitti sadece.\nYine de hissettim dediklerini.\nSöylesene, anlamak için ille de konuşmak mı gerekli?"
  },
  {
    id: 8,
    title: "Bölüm VIII",
    subtitle: "Catherine",
    color: '#F3E5F5',
    orientation: 'portrait',
    content: "- You live a long time yet Catherine.\n- An eternity without me.\n- You will look into the faces of passers by hoping for something that will for an instant bring me back to you.\n- You will find moonlit night strangely empty because,\n- When you call my name through them there will be no answer.\n- Always your heart will be aching for me and,\n- Your mind will give you the doubtful consolation that you did a brave thing."
  },
  {
    id: 9,
    title: "Bölüm IX",
    subtitle: "An Accident",
    color: '#FFCCBC',
    orientation: 'portrait',
    content: "- You despicable fool!\n- You told me it was an accident.\n+ It was an accident, Yes.\n+ But... falling in love with you was the only real accident.\n- You used my trust!\n- Does that mean everything was a lie?\n+ I lied to the world, Catherine, but never to my heart.\n- How can I believe a spy?\n+ Dont believe the spy.\n+ Believe the man who is ready to die just to stay by your side.\n- We are from different worlds, Rudolph.\n+ Then let the worlds burn. I am dangerously yours, now and forever."
  }
];

const TOTAL_PAGES = PAGES.length + 1;

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


  const activePageData = activeItemIndex !== null ? PAGES[activeItemIndex - 1] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          

          <AnimatePresence>
            {activeItemIndex !== null && activePageData && (
              <motion.div 
                className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto p-4"
                initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{ backgroundColor: '#00000000' }}
                exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
                onClick={closeActiveItem}
              >
                <motion.div
                  drag
                  dragMomentum={false}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing', rotate: 2 }}
                  dragElastic={0.1}
                  className="relative shadow-2xl rounded-sm flex flex-col items-center cursor-grab overflow-hidden touch-none"
                  style={{ 

                    width: activePageData.orientation === 'portrait' 
                           ? 'min(90vw, 400px)' 
                           : 'min(90vw, 600px)',
                    height: activePageData.orientation === 'portrait' 
                            ? 'min(80vh, 600px)' 
                            : 'min(80vh, 400px)',
                    backgroundColor: activePageData.color,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.1%22/%3E%3C/svg%3E")',
                    touchAction: 'none'
                  }}
                  initial={{ scale: 0.2, opacity: 0, y: 100 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: 0,
                    rotate: activePageData.orientation === 'landscape' ? 0 : 0, 
                    zIndex: 201
                  }}
                  exit={{ scale: 0.2, opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                >

                    <button
                        onClick={closeActiveItem}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/40 hover:bg-red-500 hover:text-white text-gray-800 rounded-full flex items-center justify-center transition-colors z-[250] shadow-sm backdrop-blur-md"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>


                    <div className="w-full h-full flex flex-col relative">

                       <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex items-center px-10 py-12">
                           <p 
                              className="w-full font-serif leading-relaxed text-left whitespace-pre-wrap select-none"
                              style={{ 
                                fontFamily: '"Dancing Script", cursive, serif',
                                color: '#1a237e',
                                opacity: 0.9,
                                fontSize: activePageData.orientation === 'landscape' ? '1.5rem' : '1.25rem', // Yatayda yazı biraz daha büyük olabilir
                                mixBlendMode: 'multiply',
                                textShadow: '0 0 1px rgba(26, 35, 126, 0.1)'
                              }}
                           >
                             {activePageData.content}
                           </p>
                       </div>
                       
                       <div className="absolute bottom-4 right-6 pointer-events-none">
                        <span className="text-[12px]" style={{ fontFamily: '"Dancing Script", cursive', color: '#1a237e', opacity: 0.5 }}>~7.01.26</span>
                       </div>
                    </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>



          <motion.div
            drag={activeItemIndex === null}
            dragMomentum={false}
            whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className={`relative ${activeItemIndex === null ? 'cursor-grab touch-none' : ''}`}
            style={{ perspective: '1500px', touchAction: activeItemIndex === null ? 'none' : 'auto' }}
          >
            
            {activeItemIndex === null && (
                <button 
                onClick={onClose} 
                className="absolute -top-12 right-0 z-50 bg-white/20 hover:bg-red-500/80 text-white rounded-full p-2 transition-all duration-300 backdrop-blur-md"
                >
                <X size={18} />
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
                

                const pageData = !isCover ? PAGES[index - 1] : null;

                const leftPageData = index < PAGES.length ? PAGES[index] : null;

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

                    <div 
                      className="absolute inset-0 w-full h-full rounded-r-lg overflow-hidden flex flex-col items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >

                      {isCover && (
                        <div className="flex flex-col items-center justify-center select-none p-4">
                            <h1 className="text-5xl font-serif text-[#e0c097] drop-shadow-lg tracking-[0.2em] opacity-90">Doğum Günü</h1>
                            <div className="w-12 h-0.5 bg-[#e0c097]/40 my-4 rounded-full" />
                            <span className="text-[10px] text-[#e0c097]/60 tracking-[0.4em] uppercase">Hediye Notları</span>
                        </div>
                      )}


                      {!isCover && pageData && (
                        <div className="flex items-center justify-center w-full h-full p-8">
                          <div 
                            className="w-[140px] h-[200px] shadow-inner rounded-sm cursor-pointer hover:scale-105 transition-transform relative"
                            style={{ 
                              backgroundColor: pageData.color,
                              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 2px 4px 6px rgba(0,0,0,0.2)'
                            }}
                            onClick={(e) => handleItemClick(e, index)}
                          >

                             <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                             
                             <div className="w-full h-full flex items-center justify-center opacity-30">
                                <span className="text-white text-4xl font-serif" style={{ fontFamily: '"Dancing Script", cursive' }}>
                                    {pageData.id}
                                </span>
                             </div>
                          </div>
                        </div>
                      )}

                      {!isCover && (
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                      )}
                    </div>


                    <div 
                      className="absolute inset-0 w-full h-full rounded-l-lg overflow-hidden flex items-center justify-center"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        backgroundColor: isCover ? '#fdf6e3' : 'transparent',
                        backgroundImage: "url('/images/paper-texture.jpg')"
                      }}
                    >

                      {leftPageData && (
                        <div className="text-center p-8 opacity-80 select-none w-full">
                            <h3 
                              className="text-xs tracking-[0.3em] text-[#5d4037] font-bold uppercase mb-4"
                              style={{ fontFamily: 'serif' }}
                            >
                              {leftPageData.title}
                            </h3>
                            <div className="w-12 h-px bg-[#5d4037]/30 mx-auto mb-4"></div>
                            <p 
                              className="text-2xl text-[#3e2723]"
                              style={{ fontFamily: '"Dancing Script", cursive' }}
                            >
                              {leftPageData.subtitle}
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