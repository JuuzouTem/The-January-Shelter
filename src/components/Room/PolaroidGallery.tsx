'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

const photos = [
  { id: 1, src: '/images/polaroids/1.jpg', caption: 'Anılar...', rotate: 2 },
  { id: 2, src: '/images/polaroids/2.jpg', caption: 'Güzel Günler', rotate: -3 },
  { id: 3, src: '/images/polaroids/3.jpg', caption: 'Favori An', rotate: 1 },
  { id: 4, src: '/images/polaroids/4.jpg', caption: 'Kış Vakti', rotate: -1 },
];

const PolaroidGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const activePhoto = photos.find(p => p.id === selectedPhoto);

  return (
    <>
      <div className="absolute top-12 left-0 w-full flex justify-center gap-4 md:gap-12 px-4 z-10">
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
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-6 bg-yellow-700 shadow-sm rounded-sm z-20" />
            <div className="bg-white p-2 pb-6 shadow-lg w-20 md:w-24 flex flex-col items-center">
              <div className="w-full h-20 bg-gray-200 overflow-hidden">
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPhoto !== null && activePhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-4 pb-16 rounded shadow-2xl max-w-sm md:max-w-md w-full relative transform rotate-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
            >
              <X size={20} />
            </button>
            <div className="w-full aspect-square bg-gray-200 mb-4 overflow-hidden">
               <img src={activePhoto.src} alt={activePhoto.caption} className="w-full h-full object-cover" />
            </div>
            <p className="text-center font-serif text-2xl italic text-gray-800">
              {activePhoto.caption}
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PolaroidGallery;