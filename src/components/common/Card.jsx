import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  padding = 'p-6',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 border
        ${
          glass
            ? 'glass-panel shadow-sm'
            : 'bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800/90 shadow-sm'
        }
        ${hoverEffect ? 'hover:border-brand-500/50 hover:shadow-md hover:-translate-y-0.5' : ''}
        ${padding}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
