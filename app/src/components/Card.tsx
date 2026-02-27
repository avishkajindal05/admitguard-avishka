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
      "bg-white dark:bg-[#1E293B] rounded-xl border border-[#EAECEF] dark:border-[#334155] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transition-colors duration-300",
      className
    )}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-[#EAECEF] dark:border-[#334155]">
          {title && <h2 className="text-lg font-semibold text-[#1F2937] dark:text-[#F1F5F9]">{title}</h2>}
          {subtitle && <p className="text-sm text-[#4B5563] dark:text-[#94A3B8] mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
