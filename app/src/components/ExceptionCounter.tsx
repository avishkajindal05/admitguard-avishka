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
  const isFlagged = count > 2;

  return (
    <div className={cn("flex flex-col items-end gap-3", className)}>
      {isFlagged && (
        <div className="flex items-center gap-3 bg-flagged-bg border border-flagged-border p-4 rounded-xl animate-in fade-in slide-in-from-right-4 duration-500">
          <ShieldAlert className="w-5 h-5 text-flagged-text" />
          <p className="text-sm font-medium text-flagged-text">
            This candidate exceeds allowed exception threshold. Entry will be flagged for manager review.
          </p>
        </div>
      )}
      
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
        count > 0 ? "bg-soft-bg border-soft-border text-soft-text" : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]"
      )}>
        <AlertTriangle className={cn("w-4 h-4", count > 0 ? "text-soft-text" : "text-[#9CA3AF]")} />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Active Exceptions: <span className="font-bold">{count}</span>
        </span>
      </div>
    </div>
  );
};

export default ExceptionCounter;
