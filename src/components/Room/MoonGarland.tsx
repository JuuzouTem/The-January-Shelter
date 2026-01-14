import React from 'react';
import { motion } from 'framer-motion';

interface MoonGarlandProps {
  onToggleMood: () => void;
  isLit: boolean;
}

const MoonGarland: React.FC<MoonGarlandProps> = ({ onToggleMood, isLit }) => {
  const moons = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕'];
  
  // İpin sarkma miktarı (dikey derinlik)
  const SAG_AMOUNT = 120; 
  
  // --- MANUEL AYAR KISMI ---
  // Buradaki her sayı, sırasıyla o ayın konumunu piksel olarak değiştirir.
  // Eksi (-) değerler ayı YUKARI çeker.
  // Artı (+) değerler ayı AŞAĞI iter.
  // 0 değeri matematiksel hesaplamayı olduğu gibi bırakır.
  // Örnek: [ -5, -2, 0, 0, 0, 0, 0, -2, -5 ] 
  // (Baştaki ve sondaki 2 taneyi yukarı çekmek için örnek değerler verdim, bunları değiştirerek tam hizala)
  const manualAdjustments = [ 4, 3, 0, 0, 0, 0, 0, 3, 4 ];
  // -------------------------

  // SVG yüksekliğini sabitliyoruz ki ekran küçüldüğünde ipin dikey oranı bozulmasın.
  const SVG_HEIGHT = SAG_AMOUNT * 2 + 30; // +30 biraz tampon alan

  return (
    <div className="relative w-full h-full cursor-pointer group" onClick={onToggleMood}>
      
      {/* İp Görünümü (SVG) */}
      <svg 
        className="absolute top-[12px] left-0 w-full pointer-events-none overflow-visible" 
        style={{ height: SVG_HEIGHT }}
        viewBox={`0 0 100 ${SVG_HEIGHT}`} 
        preserveAspectRatio="none"
      >
        {/* Parabolik İp Çizimi */}
        <path 
            d={`M0,0 Q50,${SAG_AMOUNT * 2} 100,0`}
            stroke="#E2E8F0" 
            strokeWidth="0.5" 
            fill="none" 
            className="opacity-70 drop-shadow-md" 
        />
      </svg>

      {/* Ay Emojileri */}
      <div className="flex justify-between items-start w-full relative z-10 px-0">
        {moons.map((moon, index) => {
          // 1. Matematiksel Baz Konum (Parabol Formülü)
          // Bu, ipin matematiksel olarak nerede olduğunu bulur.
          const t = index / (moons.length - 1);
          const baseCurveY = 4 * SAG_AMOUNT * t * (1 - t);

          // 2. Senin Manuel Düzeltmen
          // Dizideki ilgili değeri alıyoruz (eğer dizi kısa kalırsa hata vermesin diye || 0 diyoruz)
          const adjustment = manualAdjustments[index] || 0;

          // 3. Son Konum
          const finalPosition = baseCurveY + adjustment;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.3, rotate: 15 }}
              className="text-xl md:text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              // Burada finalPosition'ı uyguluyoruz
              style={{ marginTop: `${finalPosition}px` }} 
            >
              {moon}
            </motion.div>
          );
        })}
      </div>

      {/* Etkileşim İpucu */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ top: `${SAG_AMOUNT + 40}px` }}
      >
        <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
          {isLit ? "Işıkları Aç" : "Gece Modu"}
        </span>
      </div>
    </div>
  );
};

export default MoonGarland;