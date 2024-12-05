import React, { ReactNode } from 'react';

interface HeaderUnderlineProps {
  children: ReactNode;
  className?: string;
  color?: string;
  height?: number;
}

const HeaderUnderline: React.FC<HeaderUnderlineProps> = ({ 
  children, 
  className = '',
  color = 'var(--disabled-font-color)',
  height = 0.5 
}) => {
  return (
    <div className="relative">
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
      <div 
        className="absolute left-0 right-0 bottom-0 z-0" 
        style={{
          height,
          backgroundColor: color
        }}
      />
    </div>
  );
};

export default HeaderUnderline;