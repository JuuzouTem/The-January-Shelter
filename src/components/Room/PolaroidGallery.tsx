'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Portal için gerekli
import { X } from 'lucide-react';

const photos = [
  { id: 1, src: '/images/polaroids/1.jpg', caption: 'Anılar...', rotate: 4 },
  { id: 2, src: '/images/polaroids/2.jpg', caption: 'Kış', rotate: -2 },
];

const PolaroidGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); // Portal için client kontrolü
  const activePhoto = photos.find(p => p.id === selectedPhoto);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Container: Askıdaki Fotoğraflar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40vw] max-w-[300px] flex justify-center gap-4 z-10">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="relative cursor-pointer origin-top"
            style={{ rotate: photo.rotate }}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 20 }}
            animate={{ rotate: [photo.rotate - 1, photo.rotate + 1, photo.rotate - 1] }}
            transition={{ rotate: { duration: 3 + index, repeat: Infinity, ease: "easeInOut" } }}
            onClick={() => setSelectedPhoto(photo.id)}
          >
            {/* İp */}
            <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-0.5 h-[100px] bg-slate-400/50" />
            
            {/* Mandal */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-yellow-700 shadow-sm rounded-sm z-20" />
            
            {/* Polaroid Çerçeve (Sabit Boyutlandırma) */}
            <div className="bg-white p-2 pb-6 shadow-lg w-24 md:w-28 flex flex-col items-center transform transition-transform">
              {/* DÜZELTME: Aspect Ratio ve Object Fit eklendi */}
              <div className="w-full aspect-[4/5] bg-gray-200 overflow-hidden">
                <img 
                    src={photo.src} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modalı (PORTAL İLE BODY'YE TAŞINDI) */}
      {mounted && activePhoto && createPortal(
        <AnimatePresence>
          {selectedPhoto !== null && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl w-full max-h-screen flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Kapat Butonu */}
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-12 right-0 md:right-[-40px] bg-white/20 hover:bg-red-600 text-white rounded-full p-2 transition-all"
                >
                  <X size={24} />
                </button>

                {/* Polaroid Büyük Görünüm */}
                <div className="bg-white p-4 pb-16 rounded shadow-2xl transform rotate-1 max-h-[85vh] flex flex-col">
                   {/* DÜZELTME: Resim taşmasını önlemek için max-h ve object-contain */}
                   <div className="relative overflow-hidden flex-1 min-h-0">
                      <img 
                        src={activePhoto.src} 
                        alt={activePhoto.caption} 
                        className="max-h-[70vh] w-auto object-contain min-w-[200px]" 
                      />
                   </div>
                   <p className="text-center font-serif text-2xl italic text-gray-800 mt-4">
                      {activePhoto.caption}
                   </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default PolaroidGallery;