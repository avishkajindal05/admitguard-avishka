import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Submission, CandidateData } from '../types';
import { FIELD_CONFIG } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidateData: CandidateData;
  exceptionCount: number;
  exceptions: { field: keyof CandidateData; rationale: string }[];
  isFlagged: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  candidateData,
  exceptionCount,
  exceptions,
  isFlagged
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-[#EAECEF] dark:border-[#334155] flex items-center justify-between bg-[#F8F9FB] dark:bg-[#1E293B]">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-[#F1F5F9] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Confirm Admission Submission
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-[#EAECEF] dark:hover:bg-[#334155] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#9CA3AF]" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {isFlagged && (
            <div className="bg-flagged-bg border border-flagged-border p-4 rounded-xl flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-flagged-text" />
              <div className="text-sm font-medium text-flagged-text">
                <p className="font-bold">Flagged for Manager Review</p>
                <p>This submission contains {exceptionCount} exceptions and will be flagged.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(FIELD_CONFIG).map(([key, config]) => {
              const val = candidateData[key as keyof CandidateData];
              const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val || '—');
              
              return (
                <div key={key} className="space-y-1">
                  <p className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">{config.label}</p>
                  <p className="text-sm font-medium text-[#1F2937] dark:text-[#F1F5F9]">{displayVal}</p>
                </div>
              );
            })}
          </div>

          {exceptions.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#EAECEF] dark:border-[#334155]">
              <h3 className="text-sm font-bold text-[#1F2937] dark:text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-soft-text" />
                Active Exceptions ({exceptionCount})
              </h3>
              <div className="space-y-3">
                {exceptions.map((ex, idx) => (
                  <div key={idx} className="bg-soft-bg/20 dark:bg-soft-bg/5 border border-soft-border/30 dark:border-soft-border/10 p-3 rounded-lg">
                    <p className="text-xs font-bold text-soft-text uppercase tracking-wider mb-1">
                      {FIELD_CONFIG[ex.field].label}
                    </p>
                    <p className="text-sm text-[#4B5563] dark:text-[#94A3B8] italic">"{ex.rationale}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-[#F8F9FB] dark:bg-[#1E293B] border-t border-[#EAECEF] dark:border-[#334155] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 h-11 rounded-lg border border-[#D1D5DB] dark:border-[#334155] text-sm font-semibold text-[#4B5563] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#334155]/30 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 h-11 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
