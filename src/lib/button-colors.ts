// Couleurs harmonieuses pour les boutons selon le thème
export const buttonColors = {
  // Boutons principaux (CTA)
  primary: {
    light: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl',
      border: 'border-transparent'
    },
    dark: {
      bg: 'bg-gradient-to-r from-blue-400 to-blue-500',
      hover: 'hover:from-blue-500 hover:to-blue-600',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl',
      border: 'border-transparent'
    }
  },

  // Boutons secondaires (outline)
  secondary: {
    light: {
      bg: 'bg-transparent',
      hover: 'hover:bg-blue-50',
      text: 'text-blue-600',
      border: 'border-2 border-blue-200',
      hoverText: 'hover:text-blue-700',
      hoverBorder: 'hover:border-blue-300'
    },
    dark: {
      bg: 'bg-transparent',
      hover: 'hover:bg-blue-900/30',
      text: 'text-blue-400',
      border: 'border-2 border-blue-300',
      hoverText: 'hover:text-blue-300',
      hoverBorder: 'hover:border-blue-200'
    }
  },

  // Boutons d'action (succès, danger, etc.)
  success: {
    light: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      hover: 'hover:from-green-600 hover:to-green-700',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl'
    },
    dark: {
      bg: 'bg-gradient-to-r from-green-400 to-green-500',
      hover: 'hover:from-green-500 hover:to-green-600',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl'
    }
  },

  // Boutons d'urgence/important
  urgent: {
    light: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      hover: 'hover:from-red-600 hover:to-red-700',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl'
    },
    dark: {
      bg: 'bg-gradient-to-r from-red-400 to-red-500',
      hover: 'hover:from-red-500 hover:to-red-600',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl'
    }
  },

  // Boutons neutres
  neutral: {
    light: {
      bg: 'bg-gray-100',
      hover: 'hover:bg-gray-200',
      text: 'text-gray-700',
      border: 'border border-gray-200',
      hoverText: 'hover:text-gray-900'
    },
    dark: {
      bg: 'bg-gray-800',
      hover: 'hover:bg-gray-700',
      text: 'text-gray-200',
      border: 'border border-gray-600',
      hoverText: 'hover:text-gray-100'
    }
  }
};

// Fonction utilitaire pour obtenir les couleurs selon le thème
export const getButtonColors = (variant: keyof typeof buttonColors, theme: 'light' | 'dark' = 'light') => {
  const colors = buttonColors[variant];
  return theme === 'dark' ? colors.dark : colors.light;
};

// Classes CSS prêtes à l'emploi avec tailles UX optimisées
export const buttonClasses = {
  primary: {
    light: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    dark: 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300'
  },
  
  secondary: {
    light: 'bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-200 hover:text-blue-700 hover:border-blue-300 transition-all duration-300',
    dark: 'bg-transparent hover:bg-blue-900/30 text-blue-400 border-2 border-blue-300 hover:text-blue-300 hover:border-blue-200 transition-all duration-300'
  },
  
  success: {
    light: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    dark: 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300'
  },
  
  urgent: {
    light: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    dark: 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300'
  },
  
  neutral: {
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:text-gray-900 transition-all duration-300',
    dark: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:text-gray-100 transition-all duration-300'
  }
};
