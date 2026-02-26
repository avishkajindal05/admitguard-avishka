import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title, subtitle }) => {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-[#EAECEF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden",
      className
    )}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-[#EAECEF]">
          {title && <h2 className="text-lg font-semibold text-[#1F2937]">{title}</h2>}
          {subtitle && <p className="text-sm text-[#4B5563] mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
