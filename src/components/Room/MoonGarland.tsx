import React from 'react';
import { motion } from 'framer-motion';

interface MoonGarlandProps {
  onToggleMood: () => void;
  isLit: boolean;
}

const MoonGarland: React.FC<MoonGarlandProps> = ({ onToggleMood, isLit }) => {
  const moons = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕'];
  
  const SAG_AMOUNT = 120; 
  
  const manualAdjustments = [ 7, 3, 2, 0, 0, 0, 2, 3, 7 ];

  const SVG_HEIGHT = SAG_AMOUNT * 2 + 30;
  
  // SVG Path verisi (tekrar kullanmak için değişkene aldık)
  const pathData = `M0,0 Q50,${SAG_AMOUNT * 2} 100,0`;

  return (
    // DEĞİŞİKLİK 1: onClick'i buradan kaldırdık ve 'pointer-events-none' ekledik.
    // Böylece bu kutunun boş yerlerine tıklayınca arkadaki eşyalar (saksı vb.) çalışacak.
    <div className="relative w-full h-full group pointer-events-none">
      
      {/* İp Görünümü (SVG) */}
      <svg 
        className="absolute top-[12px] left-0 w-full overflow-visible" 
        style={{ height: SVG_HEIGHT }}
        viewBox={`0 0 100 ${SVG_HEIGHT}`} 
        preserveAspectRatio="none"
      >
        {/* DEĞİŞİKLİK 2: Tıklama Alanı (Hitbox) */}
        {/* Bu çizgi görünmezdir (transparent) ama kalındır (strokeWidth 20). 
            Buna 'pointer-events-auto' ve 'cursor-pointer' vererek ipi tıklanabilir yaptık. */}
        <path 
            d={pathData}
            stroke="transparent" 
            strokeWidth="20" 
            fill="none" 
            className="pointer-events-auto cursor-pointer"
            onClick={onToggleMood}
        />

        {/* Görünür İnce İp */}
        {/* Bunun tıklanmasına gerek yok, üstteki şeffaf ip işi görüyor */}
        <path 
            d={pathData}
            stroke="#E2E8F0" 
            strokeWidth="0.5" 
            fill="none" 
            className="opacity-70 drop-shadow-md pointer-events-none" 
        />
      </svg>

      {/* Ay Emojileri */}
      <div className="flex justify-between items-start w-full relative z-10 px-0">
        {moons.map((moon, index) => {
          const t = index / (moons.length - 1);
          const baseCurveY = 4 * SAG_AMOUNT * t * (1 - t);
          const adjustment = manualAdjustments[index] || 0;
          const finalPosition = baseCurveY + adjustment;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.3, rotate: 15 }}
              // DEĞİŞİKLİK 3: Her bir ay emojisine 'pointer-events-auto', 'cursor-pointer' ve 'onClick' ekledik.
              // Ana kapsayıcı pointer-events-none olduğu için bu özellik şart.
              className="text-xl md:text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] pointer-events-auto cursor-pointer"
              style={{ marginTop: `${finalPosition}px` }} 
              onClick={onToggleMood}
            >
              {moon}
            </motion.div>
          );
        })}
      </div>

      {/* Etkileşim İpucu */}
      {/* İpucu kutusu da görünmeli ama tıklamaları engellememeli */}
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