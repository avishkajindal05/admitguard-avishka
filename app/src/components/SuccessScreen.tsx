import React from 'react';
import { CheckCircle2, PlusCircle, History, ShieldAlert } from 'lucide-react';
import { Submission } from '../types';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

interface SuccessScreenProps {
  submission: Submission;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ submission, onReset }) => {
  const { setCurrentView } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mb-6 shadow-lg shadow-success-bg/20">
        <CheckCircle2 className="w-10 h-10 text-success-text" />
      </div>
      
      <h2 className="text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F9] mb-2 text-center">Submission Successful</h2>
      <p className="text-[#6B7280] dark:text-[#94A3B8] text-center mb-10 max-w-md">
        Candidate admission data has been recorded and added to the audit log.
      </p>

      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-[#EAECEF] dark:border-[#334155] rounded-2xl overflow-hidden shadow-sm mb-10">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[#EAECEF] dark:border-[#334155]">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Candidate</span>
            <span className="text-sm font-bold text-[#1F2937] dark:text-[#F1F5F9]">{submission.candidateData.fullName}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-[#EAECEF] dark:border-[#334155]">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Timestamp</span>
            <span className="text-sm font-medium text-[#4B5563] dark:text-[#94A3B8]">{format(new Date(submission.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-[#EAECEF] dark:border-[#334155]">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Exceptions</span>
            <span className="text-sm font-bold text-soft-text">{submission.exceptionCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Status</span>
            {submission.flagged ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-flagged-bg text-flagged-text text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3 h-3" />
                Flagged
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-success-bg text-success-text text-xs font-bold uppercase tracking-wider">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 h-11 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Add Another Candidate
        </button>
        <button
          onClick={() => setCurrentView('audit-log')}
          className="flex items-center gap-2 px-6 h-11 rounded-lg border border-[#D1D5DB] dark:border-[#334155] text-sm font-semibold text-[#4B5563] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] transition-all"
        >
          <History className="w-4 h-4" />
          Go to Audit Log
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
