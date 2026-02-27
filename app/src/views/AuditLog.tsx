import React, { useState } from 'react';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { Search, Filter, Eye, ShieldAlert, CheckCircle2, X, Trash2, AlertTriangle, Download, FileJson } from 'lucide-react';
import { Submission, CandidateData } from '../types';
import { FIELD_CONFIG } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AuditLog: React.FC = () => {
  const { submissions, clearSubmissions } = useAppContext();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'flagged' | 'exceptions'>('all');

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      s.candidateData.fullName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      s.candidateData.email.toLowerCase().includes(localSearchQuery.toLowerCase());
    
    if (filter === 'flagged') return matchesSearch && s.flagged;
    if (filter === 'exceptions') return matchesSearch && s.exceptionCount > 0;
    return matchesSearch;
  });

  const handleClearLog = () => {
    clearSubmissions();
    setIsClearModalOpen(false);
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (submissions.length === 0) {
      setExportError("No data to export");
      setTimeout(() => setExportError(null), 3000);
      return;
    }
    const date = format(new Date(), 'yyyy-MM-dd');
    const content = JSON.stringify(submissions, null, 2);
    downloadFile(content, `admitguard-audit-${date}.json`, 'application/json');
  };

  const exportCSV = () => {
    if (submissions.length === 0) {
      setExportError("No data to export");
      setTimeout(() => setExportError(null), 3000);
      return;
    }
    const date = format(new Date(), 'yyyy-MM-dd');
    const headers = [
      "ID", "Timestamp", "Full Name", "Email", "Phone", "DOB", "Qualification", 
      "Grad Year", "Score", "Screening Score", "Interview Status", "Aadhaar", 
      "Offer Letter Sent", "Exception Count", "Flagged", "Exception Fields", "Exception Rationales"
    ];

    const rows = submissions.map(s => {
      const exFields = s.exceptions.map(ex => ex.field).join('|');
      const exRationales = s.exceptions.map(ex => ex.rationale).join('|');
      
      return [
        s.id,
        s.timestamp,
        s.candidateData.fullName,
        s.candidateData.email,
        s.candidateData.phone,
        s.candidateData.dob,
        s.candidateData.highestQualification,
        s.candidateData.graduationYear,
        s.candidateData.percentageOrCgpa,
        s.candidateData.screeningScore,
        s.candidateData.interviewStatus,
        s.candidateData.aadhaarNumber,
        s.candidateData.offerLetterSent ? "Yes" : "No",
        s.exceptionCount,
        s.flagged ? "Yes" : "No",
        exFields,
        exRationales
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
    });

    const content = [headers.join(','), ...rows].join('\n');
    downloadFile(content, `admitguard-audit-${date}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F9]">Audit Log</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">Immutable record of all successful admissions.</p>
        </div>
        <div className="flex items-center gap-3">
          {exportError && (
            <span className="text-xs font-medium text-amber-600 animate-in fade-in slide-in-from-right-2">
              {exportError}
            </span>
          )}
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-sm font-medium text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#F8F9FB] dark:hover:bg-[#1E293B] transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={exportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-sm font-medium text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#F8F9FB] dark:hover:bg-[#1E293B] transition-all"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </button>
          <button 
            onClick={() => setIsClearModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear Log
          </button>
        </div>
      </div>

      <Card className="p-0">
        <div className="p-4 border-b border-[#EAECEF] dark:border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#64748B]" />
            <input 
              type="text"
              placeholder="Filter by name or email..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 rounded-lg border border-[#EAECEF] dark:border-[#334155] bg-[#F8F9FB] dark:bg-[#0F172A] text-sm outline-none focus:border-primary transition-all dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'flagged', 'exceptions'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                  filter === f 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-[#F3F4F6] dark:bg-[#0F172A] text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#E5E7EB] dark:hover:bg-[#334155]"
                )}
              >
                {f === 'all' ? 'All' : f === 'flagged' ? 'Flagged Only' : 'With Exceptions'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#EAECEF] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Exceptions</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF] dark:divide-[#334155]" aria-live="polite">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#9CA3AF] dark:text-[#64748B] italic">
                    No submissions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8F9FB] dark:hover:bg-[#334155]/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#1F2937] dark:text-[#F1F5F9]">{s.candidateData.fullName}</div>
                      <div className="text-xs text-[#9CA3AF] dark:text-[#64748B]">{s.candidateData.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4B5563] dark:text-[#94A3B8]">
                      {format(new Date(s.timestamp), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${s.exceptionCount > 0 ? 'text-soft-text' : 'text-[#9CA3AF] dark:text-[#64748B]'}`}>
                        {s.exceptionCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.flagged ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                          <ShieldAlert className="w-3 h-3" />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedSubmission(s)}
                        className="p-2 text-[#9CA3AF] dark:text-[#64748B] hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Clear Log Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsClearModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-[#F1F5F9] mb-2">Clear Audit Log?</h2>
              <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-6">
                Are you sure you want to clear all audit logs? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#334155] text-sm font-semibold text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#F8F9FB] dark:hover:bg-[#0F172A] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearLog}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal Shell */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSubmission(null)} />
          <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-[#EAECEF] dark:border-[#334155] flex items-center justify-between bg-[#F8F9FB] dark:bg-[#1E293B]">
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-[#F1F5F9]">Submission Details</h2>
              <button onClick={() => setSelectedSubmission(null)} className="p-1 hover:bg-[#EAECEF] dark:hover:bg-[#334155] rounded-full transition-colors">
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-[#0F172A] rounded-xl border border-[#EAECEF] dark:border-[#334155]">
                <div className="text-center px-4 border-r border-[#EAECEF] dark:border-[#334155]">
                  <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider mb-1">Exceptions</p>
                  <p className="text-lg font-bold text-[#1F2937] dark:text-[#F1F5F9]">{selectedSubmission.exceptionCount}</p>
                </div>
                <div className="text-center px-4 border-r border-[#EAECEF] dark:border-[#334155]">
                  <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider mb-1">Flagged</p>
                  <p className={`text-sm font-bold uppercase ${selectedSubmission.flagged ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedSubmission.flagged ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider mb-1">Submitted At</p>
                  <p className="text-xs font-medium text-[#4B5563] dark:text-[#94A3B8]">
                    {format(new Date(selectedSubmission.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(FIELD_CONFIG).map(([key, config]) => (
                  <div key={key}>
                    <p className="text-[11px] font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">{config.label}</p>
                    <p className="text-sm font-medium text-[#1F2937] dark:text-[#F1F5F9]">
                      {String(selectedSubmission.candidateData[key as keyof CandidateData])}
                    </p>
                  </div>
                ))}
              </div>
              
              {selectedSubmission.exceptions.length > 0 && (
                <div className="pt-4 border-t border-[#EAECEF] dark:border-[#334155] space-y-3">
                  <h3 className="text-xs font-bold text-[#1F2937] dark:text-[#F1F5F9] uppercase tracking-wider">Exceptions & Rationales</h3>
                  {selectedSubmission.exceptions.map((ex, i) => (
                    <div key={i} className="bg-soft-bg/20 dark:bg-soft-bg/5 p-3 rounded-lg border border-soft-border/30 dark:border-soft-border/10">
                      <p className="text-xs font-bold text-soft-text uppercase mb-1">{FIELD_CONFIG[ex.field].label}</p>
                      <p className="text-sm text-[#4B5563] dark:text-[#94A3B8] italic">"{ex.rationale}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
