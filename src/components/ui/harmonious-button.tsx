import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { buttonClasses } from '@/lib/button-colors';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface HarmoniousButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'urgent' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const HarmoniousButton = React.forwardRef<HTMLButtonElement, HarmoniousButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, asChild = false, ...props }, ref) => {
    const { theme } = useTheme();
    const currentTheme = theme === 'system' ? 'light' : theme;
    
    const sizeClasses = {
      xs: 'px-3 py-2 text-xs h-8',
      sm: 'px-4 py-2.5 text-sm h-10',
      md: 'px-5 py-3 text-sm h-11',
      lg: 'px-6 py-3.5 text-base h-12',
      xl: 'px-8 py-4 text-lg h-14'
    };

    const baseClasses = 'font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center justify-center';
    const themeClasses = buttonClasses[variant][currentTheme as 'light' | 'dark'];
    const sizeClass = sizeClasses[size];

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(
          baseClasses,
          themeClasses,
          sizeClass,
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

HarmoniousButton.displayName = 'HarmoniousButton';

export default HarmoniousButton;
