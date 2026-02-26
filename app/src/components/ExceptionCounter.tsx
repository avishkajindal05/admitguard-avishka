import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ExceptionCounterProps {
  count: number;
  className?: string;
}

const ExceptionCounter: React.FC<ExceptionCounterProps> = ({ count, className }) => {
  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      aria-live="polite"
    >
      <AlertTriangle className={cn("w-4 h-4", count > 0 ? "text-amber-600" : "text-[#9CA3AF]")} />
      <span className={cn(
        "text-sm font-semibold",
        count > 0 ? "text-amber-600" : "text-[#6B7280]"
      )}>
        Active Exceptions: {count}/4
      </span>
    </div>
  );
};

export default ExceptionCounter;
