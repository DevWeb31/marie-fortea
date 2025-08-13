import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn';
  delay?: number;
  duration?: number;
  threshold?: number;
}

const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  }
};

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  threshold = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={animations[animation]}
      initial="hidden"
      animate={controls}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
};

// Composant spécialisé pour les sections
export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <ScrollAnimation
    className={className}
    animation="slideUp"
    delay={delay}
    duration={0.8}
  >
    {children}
  </ScrollAnimation>
);

// Composant pour les cartes avec animation en cascade
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  index?: number;
}> = ({ children, className = '', index = 0 }) => (
  <ScrollAnimation
    className={className}
    animation="scaleIn"
    delay={index * 0.1}
    duration={0.6}
  >
    {children}
  </ScrollAnimation>
);

// Composant pour les titres avec animation spéciale
export const AnimatedTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <ScrollAnimation
    className={className}
    animation="slideUp"
    delay={delay}
    duration={1}
  >
    {children}
  </ScrollAnimation>
);

// Composant pour les listes avec animation en cascade
export const AnimatedList: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ threshold: 0.1 }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
  >
    {children}
  </motion.div>
);

export default ScrollAnimation;
