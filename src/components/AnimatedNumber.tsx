import React, { useState, useRef, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
  colorClass?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value, 
  suffix = '', 
  duration = 2000, 
  colorClass = 'text-blue-600 dark:text-blue-400' 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateNumber();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateNumber = () => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = parseInt(value.toString().replace(/\D/g, ''));

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(true);
        // Démarrer l'animation continue après un délai
        setTimeout(() => {
          startContinuousAnimation();
        }, 1000);
      }
    };

    animate();
  };

  const startContinuousAnimation = () => {
    // Effet de léger grossissement puis retour à la taille initiale
    let cycles = 0;
    const maxCycles = 3; // Limite à 3 cycles
    const duration = 400; // Durée totale d'un cycle en ms (réduite)
    
    const growAndShrink = () => {
      if (!isAnimating) return;
      
      const startTime = Date.now();
      
      const animate = () => {
        if (!isAnimating) return;
        
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress <= 1) {
          // Phase de croissance puis réduction
          let scale;
          if (progress <= 0.5) {
            // Croissance de 0 à 0.1 (10% de grossissement)
            scale = 1 + (progress * 2) * 0.1;
          } else {
            // Réduction de 0.1 à 0
            scale = 1 + (1 - (progress - 0.5) * 2) * 0.1;
          }
          
          if (ref.current) {
            ref.current.style.transform = `scale(${scale})`;
          }
          
          requestAnimationFrame(animate);
        } else {
          // Cycle terminé
          cycles++;
          
          if (ref.current) {
            ref.current.style.transform = 'scale(1)';
          }
          
          if (cycles < maxCycles) {
            // Démarrer le prochain cycle après un délai réduit
            setTimeout(() => {
              if (isAnimating) {
                growAndShrink();
              }
            }, 150); // Délai réduit entre les cycles
          } else {
            // Tous les cycles terminés
            setIsAnimating(false);
            if (ref.current) {
              ref.current.style.transform = 'scale(1)';
            }
          }
        }
      };
      
      animate();
    };
    
    growAndShrink();
  };

  return (
    <div 
      ref={ref} 
      className={`text-2xl font-bold sm:text-3xl transition-all duration-300 ${colorClass}`}
    >
      {displayValue}{suffix}
    </div>
  );
};

export default AnimatedNumber;
