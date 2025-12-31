import React, { useEffect, useRef } from 'react';

// Utility for random numbers
const random = (min: number, max: number) => Math.random() * (max - min) + min;

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;

  constructor(x: number, y: number, hue: number, saturation: number, lightness: number) {
    this.x = x;
    this.y = y;
    // Explosion physics
    const angle = random(0, Math.PI * 2);
    // Varied speed for realism
    const speed = random(0.5, 5); 
    const friction = 0.96;
    
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // Visuals
    this.alpha = 1;
    this.decay = random(0.005, 0.015);
    this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    this.size = random(1.5, 3);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.035; // Soft gravity
    this.vx *= 0.95; // Air resistance
    this.vy *= 0.95;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Firework {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  hue: number;
  saturation: number;
  lightness: number;
  dead: boolean = false;
  exploded: boolean = false;
  particles: Particle[] = [];

  constructor(sx: number, sy: number, tx: number, ty: number) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    
    const distanceToTarget = Math.hypot(tx - sx, ty - sy);
    const angle = Math.atan2(ty - sy, tx - sx);
    const speed = distanceToTarget / 50; 
    
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // Romantic Color Palette Selection
    // We want Pinks, Rose Golds, Warm Silvers. No harsh greens/blues.
    const palette = [
      { h: 330, s: 100, l: 70 }, // Hot Pink
      { h: 350, s: 100, l: 80 }, // Light Pink
      { h: 300, s: 60, l: 70 },  // Soft Purple
      { h: 45, s: 90, l: 60 },   // Gold
      { h: 200, s: 0, l: 90 },   // Silver/White
      { h: 10, s: 80, l: 65 },   // Salmon/Red
    ];
    
    const choice = palette[Math.floor(random(0, palette.length))];
    this.hue = choice.h;
    this.saturation = choice.s;
    this.lightness = choice.l;
  }

  update() {
    if (!this.exploded) {
      this.x += this.vx;
      this.y += this.vy;
      
      const dist = Math.hypot(this.tx - this.x, this.ty - this.y);
      if (dist < 5 || this.vy >= 0) { 
        this.explode();
      }
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update();
        if (this.particles[i].alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
      if (this.particles.length === 0) {
        this.dead = true;
      }
    }
  }

  explode() {
    this.exploded = true;
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.x, this.y, this.hue, this.saturation, this.lightness));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      // Trail effect for rising firework
      ctx.globalAlpha = 1;
      ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      this.particles.forEach(p => p.draw(ctx));
    }
  }
}

interface FireworksCanvasProps {
  active: boolean;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let timer = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = () => {
      // Soft trail effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      if (active) {
        timer++;
        // Frequent launches for a "Show" effect
        if (timer % 15 === 0) {
          const startX = random(canvas.width * 0.2, canvas.width * 0.8);
          const targetX = random(canvas.width * 0.1, canvas.width * 0.9);
          const targetY = random(canvas.height * 0.1, canvas.height * 0.5);
          fireworksRef.current.push(new Firework(startX, canvas.height, targetX, targetY));
        }
      }

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        fw.update();
        fw.draw(ctx);
        if (fw.dead) {
          fireworksRef.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  const handleClick = (e: React.MouseEvent) => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    fireworksRef.current.push(new Firework(canvas.width / 2, canvas.height, x, y));
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="absolute inset-0 z-0 touch-none"
      style={{ cursor: active ? 'crosshair' : 'default' }}
    />
  );
};