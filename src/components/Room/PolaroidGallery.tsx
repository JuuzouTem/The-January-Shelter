'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { X } from 'lucide-react';

const photos = [
  // rotate değerleri sabit duruş açılarıdır
  { id: 1, src: '/images/polaroids/1.jpg', caption: 'Anılar...', rotate: -2 },
  { id: 2, src: '/images/polaroids/2.jpg', caption: 'Kış', rotate: -2 },
];

const PolaroidGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const activePhoto = photos.find(p => p.id === selectedPhoto);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Container: Panodaki Fotoğraflar */}
      {/* width fit-content yaptık ki içindekiler kadar yer kaplasın */}
      <div className="relative w-fit flex gap-[5%] p-4"> 
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="relative cursor-pointer"
            // Sallanma animasyonu SİLİNDİ. Sadece duruş açısı var.
            initial={{ rotate: photo.rotate }}
            whileHover={{ scale: 1.1, zIndex: 50, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setSelectedPhoto(photo.id)}
          >
            
            {/* Polaroid Çerçeve - BOYUTLAR EŞİTLENDİ */}
            {/* w-24 (96px) ve h-32 (128px) olarak sabitledik. Resim ne olursa olsun bu boyutta olacak. */}
            <div className="bg-white p-2 pb-8 shadow-md w-24 h-32 flex flex-col items-center">
              
              <div className="w-full h-full bg-gray-100 overflow-hidden">
                <img 
                    src={photo.src} 
                    alt={photo.caption} 
                    // object-cover: Resmi kutuya sığdırır ve fazlalıkları keser (böylece bozulmaz)
                    className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modalı (Burası aynı kaldı) */}
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
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-12 right-0 md:right-[-40px] bg-white/20 hover:bg-red-600 text-white rounded-full p-2 transition-all"
                >
                  <X size={24} />
                </button>

                <div className="bg-white p-4 pb-16 rounded shadow-2xl transform rotate-1 max-h-[85vh] flex flex-col">
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