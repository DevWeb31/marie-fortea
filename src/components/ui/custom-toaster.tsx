import React from 'react';
import CustomToast from './custom-toast';
import { useCustomToast } from '@/hooks/use-custom-toast';

export const CustomToaster: React.FC = () => {
  const { toasts, dismiss } = useCustomToast();

  return (
    <>
      {toasts.map((toast) => (
        <CustomToast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => dismiss(toast.id)}
        />
      ))}
    </>
  );
};

// Export du hook pour utilisation dans les composants
export { useCustomToast };
