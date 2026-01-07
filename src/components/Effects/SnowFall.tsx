'use client';

import React, { useEffect, useRef } from 'react';

export default function SnowFall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas boyutlarını ayarla
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Kar tanesi sayısı (Google AI Studio tarzı yoğunluk için 100-150 ideal)
    const maxParticles = 150;
    
    // Parçacık dizisi
    const particles: any[] = [];

    // Parçacıkları oluştur
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * W, // Yatay konum
        y: Math.random() * H, // Dikey konum
        r: Math.random() * 3 + 1, // Yarıçap (1px ile 4px arası - derinlik hissi için)
        d: Math.random() * maxParticles, // Yoğunluk (düşüş hızını etkiler)
        a: Math.random() * 0.5 + 0.1 // Opaklık (0.1 ile 0.6 arası - fluluk verir)
      });
    }

    let animationFrameId: number;
    let angle = 0; // Rüzgar açısı

    function draw() {
      if (!ctx || !canvas) return;

      // Her karede ekranı temizle
      ctx.clearRect(0, 0, W, H);

      // Kar tanelerini çiz
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        
        ctx.moveTo(p.x, p.y);
        // Her taneye özel opaklık vererek derinlik hissi yarat
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`; 
        // Daire çiz (daha yumuşak görünüm için)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.fill();
      }

      update();
      animationFrameId = requestAnimationFrame(draw);
    }

    // Pozisyonları güncelle (Fizik motoru)
    function update() {
      angle += 0.01; // Rüzgar açısını yavaşça değiştir

      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];

        // Aşağı düşüş ve rüzgar (sinüs dalgası ile sağa sola salınım)
        // Math.cos(angle + p.d) kısmı o "doğal süzülme" efektini verir
        // p.r (yarıçap) eklentisi büyük tanelerin daha hızlı düşmesini sağlar (Parallax)
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;

        // Tane ekranın dışına çıkarsa yukarıdan tekrar başlat
        if (p.x > W + 5 || p.x < -5 || p.y > H) {
          if (i % 3 > 0) { // %66 ihtimalle
            particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d, a: p.a };
          } else {
            // Karın sağdan veya soldan da girebilmesi için (rüzgar varmış gibi)
            if (Math.sin(angle) > 0) {
              particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d, a: p.a };
            } else {
              particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d, a: p.a };
            }
          }
        }
      }
    }

    // Ekran boyutu değişirse canvas'ı güncelle
    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener('resize', handleResize);
    
    // Animasyonu başlat
    draw();

    // Temizlik (Component unmount olduğunda)
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // NOT: Z-index ve fixed pozisyonu page.tsx içinde ayarlanmış durumda.
  // Buradaki className sadece canvas'ın tam ekran olmasını sağlar.
  return (
    <canvas 
      ref={canvasRef} 
      className="block w-full h-full"
    />
  );
}