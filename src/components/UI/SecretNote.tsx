'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecretNoteProps {
  isOpen: boolean;
  onClose: () => void;
}

let SAVED_POSITION = { x: 0, y: 0 };

const SecretNote: React.FC<SecretNoteProps> = ({ isOpen, onClose }) => {
  
  const textColor = "#0a0a0a"; 

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.05, cursor: "grabbing" }}
            
            onDragEnd={(event, info) => {
                SAVED_POSITION = {
                    x: SAVED_POSITION.x + info.offset.x,
                    y: SAVED_POSITION.y + info.offset.y
                };
            }}

            initial={{ scale: 0.8, opacity: 0, x: SAVED_POSITION.x, y: SAVED_POSITION.y }}
            animate={{ scale: 1, opacity: 1, x: SAVED_POSITION.x, y: SAVED_POSITION.y }}
            exit={{ scale: 0.8, opacity: 0, x: SAVED_POSITION.x, y: SAVED_POSITION.y, transition: { duration: 0.2 } }}

            className="relative p-8 w-full max-w-md shadow-[2px_4px_20px_rgba(0,0,0,0.6)] cursor-grab"
            style={{
              color: textColor,
              fontFamily: "'Courier New', Courier, monospace",
              background: 'linear-gradient(135deg, #e0c395 0%, #cda670 100%)',
              border: '1px solid #b08d55',
              boxShadow: 'inset 0 0 60px rgba(139, 69, 19, 0.15), 5px 5px 15px rgba(0,0,0,0.3)' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10" 
                 style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')"}}></div>

            <h3 
              className="text-xl font-bold mb-3 mt-1 text-center border-b-2 pb-2 tracking-widest uppercase"
              style={{ borderColor: `${textColor}40` }}
            >
              Sürpriz Hikaye...
            </h3>
            
            <div className="space-y-2 text-sm md:text-base leading-snug font-semibold select-none">
              <p>Görmüyorum artık sabah kalktığımdaki o gölgeyi.</p>
              <p>Gözlerimi yakıyordu gökyüzünün yanağındaki kan damlası.</p>
              <p>Hissederdim hâlâ daha o sıcağı ama ne fayda.</p>
              <p>Ne zaman düşse göğün gümüş iğneleri, giderdi o kızıl.</p>
              <p>Kalırdım donmuş zamanın ortasında. Öyle miydi eskiden?</p>
              <p>Yok muydu zamanımı eritecek bir çift diş?</p>
              <p>Ne zaman gelse nurun perdeleri, kalırdı bir garip yoldaş yanımda.</p>
              <p>Son zamanlarda bir ad takınmış kendine.</p>
              <p>Yalınlıkmış adı...</p> 
              
              <p className="text-right mt-6 italic opacity-80 text-sm">
                - Bir dosttan hikâyeler..
              </p>
            </div>

            <div 
                className="mt-6 text-center text-[10px] opacity-50 uppercase tracking-widest cursor-pointer hover:opacity-100 transition-opacity"
                onClick={onClose}
            >
              (Kapatmak için tıkla)
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SecretNote;