import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme-provider';

interface Bubble {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: number;
  color: string;
  velocity: { x: number; y: number };
}

const MouseTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const bubbleIdRef = useRef(0);
  const { theme } = useTheme();

  // Palette de couleurs harmonieuses avec le thème petite enfance
  const getThemeColors = () => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      return [
        'rgba(255, 182, 193, 0.6)', // Rose clair
        'rgba(173, 216, 230, 0.6)', // Bleu clair
        'rgba(144, 238, 144, 0.6)', // Vert clair
        'rgba(255, 218, 185, 0.6)', // Pêche
        'rgba(221, 160, 221, 0.6)', // Lavande
      ];
    } else {
      return [
        'rgba(255, 182, 193, 0.4)', // Rose clair
        'rgba(173, 216, 230, 0.4)', // Bleu clair
        'rgba(144, 238, 144, 0.4)', // Vert clair
        'rgba(255, 218, 185, 0.4)', // Pêche
        'rgba(221, 160, 221, 0.4)', // Lavande
      ];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajuster la taille du canvas à la fenêtre
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gestionnaire de mouvement de la souris
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      const colors = getThemeColors();
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Créer une nouvelle bulle avec mouvement plus doux
      const newBubble: Bubble = {
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2, // Taille plus petite entre 2 et 6px
        opacity: 0.6, // Opacité initiale plus faible
        id: bubbleIdRef.current++,
        color: randomColor,
        velocity: {
          x: (Math.random() - 0.5) * 0.8, // Mouvement horizontal plus lent
          y: (Math.random() - 0.5) * 0.8  // Mouvement vertical plus lent
        }
      };
      
      bubblesRef.current.push(newBubble);
      
      // Limiter le nombre de bulles pour plus de fluidité
      if (bubblesRef.current.length > 12) {
        bubblesRef.current.shift();
      }
    };

    // Fonction d'animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Mettre à jour et dessiner chaque bulle
      bubblesRef.current = bubblesRef.current.filter(bubble => {
        // Appliquer la vélocité avec mouvement plus fluide
        bubble.x += bubble.velocity.x;
        bubble.y += bubble.velocity.y;
        
        // Réduire l'opacité et augmenter très légèrement la taille
        bubble.opacity -= 0.008; // Disparition plus lente
        bubble.size += 0.02; // Croissance plus douce
        
        // Ralentir le mouvement de manière plus progressive
        bubble.velocity.x *= 0.99; // Ralentissement plus doux
        bubble.velocity.y *= 0.99;
        
        // Supprimer les bulles trop transparentes ou trop grandes
        if (bubble.opacity <= 0 || bubble.size > 15) return false;
        
        // Dessiner la bulle avec un effet plus doux
        ctx.save();
        ctx.globalAlpha = bubble.opacity;
        
        // Créer un dégradé radial pour un effet plus naturel
        const gradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, bubble.size
        );
        
        // Extraire la couleur de base
        const baseColor = bubble.color.replace(/[0-9.]+\)$/, '0.8)');
        const centerColor = bubble.color.replace(/[0-9.]+\)$/, '0.4)');
        
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.7, bubble.color);
        gradient.addColorStop(1, centerColor);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Ajouter un contour subtil
        ctx.strokeStyle = bubble.color.replace(/[0-9.]+\)$/, `${bubble.opacity * 0.3})`);
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        ctx.restore();
        
        return true;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Démarrer l'animation
    animate();
    
    // Ajouter les event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ zIndex: 9999 }}
    />
  );
};

export default MouseTrail;
