import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  imageSrc?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  imageSrc = '/android-chrome-192x192.png' // Utilise votre image par défaut
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className={`flex ${sizeClasses[size]} items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-green-400 transition-transform duration-200 group-hover:scale-105 overflow-hidden ${className}`}>
      {/* Image du logo personnalisée */}
      <img
        src={imageSrc}
        alt="Marie Fortea Logo"
        className={`${sizeClasses[size]} object-cover rounded-full`}
        onError={(e) => {
          // Fallback si l'image ne charge pas
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Logo;
