import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  onClick 
}) => {
  return (
    <div 
      className={`glass-panel rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${padding} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;