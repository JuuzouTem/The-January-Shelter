'use client';

import React, { useEffect, useRef } from 'react';

export default function SnowFall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const maxParticles = 150;
    const particles: any[] = [];

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 3 + 1,
        d: Math.random() * maxParticles,
        a: Math.random() * 0.5 + 0.1
      });
    }

    let animationFrameId: number;
    let angle = 0;

    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, W, H);
      

      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`; 
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.fill();
      }

      update();
      animationFrameId = requestAnimationFrame(draw);
    }


    function update() {
      angle += 0.01;

      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];

        
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;

        if (p.x > W + 5 || p.x < -5 || p.y > H) {
          if (i % 3 > 0) {
            p.x = Math.random() * W;
            p.y = -10;
          } else {
            if (Math.sin(angle) > 0) {
              p.x = -5;
              p.y = Math.random() * H;
            } else {
              p.x = W + 5;
              p.y = Math.random() * H;
            }
          }
        }
      }
    }


    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener('resize', handleResize);
    
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="block w-full h-full"
    />
  );
}