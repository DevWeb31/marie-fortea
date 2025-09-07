import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!duration) return;

    const startTime = Date.now();
    const totalDuration = duration;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalDuration - elapsed);
      const progressPercent = (remaining / totalDuration) * 100;
      
      setProgress(progressPercent);
      
      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsVisible(false);
        onClose?.();
      }
    };

    const animationId = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100] flex w-full max-w-sm items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all',
        variant === 'default' 
          ? 'border bg-background text-foreground' 
          : 'border-destructive bg-destructive text-destructive-foreground',
        className
      )}
    >
      <div className="grid gap-1">
        {title && (
          <div className="text-sm font-semibold">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1"
      >
        <X className="h-4 w-4" />
      </button>
      
      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full overflow-hidden">
        <div
          className="h-full bg-current transition-none"
          style={{ 
            width: `${progress}%`,
            transition: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default CustomToast;
