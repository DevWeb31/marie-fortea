import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail, Send } from 'lucide-react';

interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isVisible,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState<'sending' | 'success' | 'complete'>('sending');

  useEffect(() => {
    if (!isVisible) return;

    // Phase d'envoi (1.5 secondes)
    const sendingTimer = setTimeout(() => {
      setAnimationPhase('success');
    }, 1500);

    // Phase de succès (2 secondes)
    const successTimer = setTimeout(() => {
      setAnimationPhase('complete');
    }, 3500);

    // Animation terminée (0.5 seconde après le succès)
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 4000);

    return () => {
      clearTimeout(sendingTimer);
      clearTimeout(successTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 bg-black/30 backdrop-blur-sm"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="relative"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        
        {/* Cercle de fond animé */}
        <div 
          className="absolute"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            transition: 'all 1s ease-in-out',
            backgroundColor: animationPhase === 'sending' 
              ? 'rgba(59, 130, 246, 0.1)' 
              : 'rgba(34, 197, 94, 0.1)',
            transform: animationPhase === 'sending' 
              ? 'translate(-50%, -50%) scale(1)' 
              : animationPhase === 'success'
              ? 'translate(-50%, -50%) scale(1.1)'
              : 'translate(-50%, -50%) scale(1)',
            animation: animationPhase === 'sending' ? 'pulse 1.5s ease-in-out infinite' : 'none'
          }}
        />

        {/* Icône principale */}
        <div 
          className="relative"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {animationPhase === 'sending' ? (
            <div className="flex items-center justify-center">
              <div className="relative">
                <Send className="h-12 w-12 text-blue-600 animate-bounce" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CheckCircle 
                className={`h-16 w-16 text-green-600 transition-all duration-500 ${
                  animationPhase === 'success' 
                    ? 'scale-110 animate-bounce' 
                    : 'scale-100'
                }`}
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(34, 197, 94, 0.3))'
                }}
              />
            </div>
          )}
        </div>

        {/* Particules flottantes */}
        <div 
          className="absolute pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full transition-all duration-2000"
              style={{
                position: 'absolute',
                left: `${30 + i * 8}%`,
                top: `${20 + (i % 3) * 25}%`,
                backgroundColor: animationPhase === 'success' ? '#4ade80' : '#60a5fa',
                opacity: animationPhase === 'success' ? 1 : 0,
                animation: animationPhase === 'success' 
                  ? `floatUp 2s ease-out ${i * 0.1}s forwards` 
                  : 'none'
              }}
            />
          ))}
        </div>

        {/* Message de succès */}
        <div
          className="absolute transition-all duration-700"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: animationPhase === 'success' || animationPhase === 'complete'
              ? 'translate(-50%, -50%) translate(0, 80px)'
              : 'translate(-50%, -50%) translate(0, 100px)',
            opacity: animationPhase === 'success' || animationPhase === 'complete' ? 1 : 0
          }}
        >
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Message envoyé !
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                Votre demande a été transmise avec succès.<br />
                Je vous recontacterai rapidement.
              </p>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 ${
                  animationPhase === 'complete' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Effet de vague */}
        <div 
          className="absolute pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <div 
            className="absolute rounded-full transition-all duration-2000"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              scale: animationPhase === 'success' ? 1.5 : 1,
              opacity: animationPhase === 'success' ? 0 : 0,
              animation: animationPhase === 'success' ? 'ripple 2s ease-out' : 'none'
            }}
          />
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessAnimation;
