import React, { useState } from 'react';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { Search, Filter, Eye, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { Submission, CandidateData } from '../types';
import { FIELD_CONFIG } from '../constants';

const AuditLog: React.FC = () => {
  const { submissions } = useAppContext();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">Audit Log</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-medium text-[#4B5563] hover:bg-[#F8F9FB] transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-hover transition-all">
            Export CSV
          </button>
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EAECEF]">
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Exceptions</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#9CA3AF] italic">
                    No submissions found in the audit log.
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8F9FB] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#1F2937]">{s.candidateData.fullName}</div>
                      <div className="text-xs text-[#9CA3AF]">{s.candidateData.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4B5563]">
                      {format(new Date(s.timestamp), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${s.exceptionCount > 0 ? 'text-soft-text' : 'text-[#9CA3AF]'}`}>
                        {s.exceptionCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.flagged ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-flagged-bg text-flagged-text text-[10px] font-bold uppercase tracking-wider">
                          <ShieldAlert className="w-3 h-3" />
                          Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-bg text-success-text text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedSubmission(s)}
                        className="p-2 text-[#9CA3AF] hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
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

      {/* Details Modal Shell */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSubmission(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-[#EAECEF] flex items-center justify-between bg-[#F8F9FB]">
              <h2 className="text-lg font-bold text-[#1F2937]">Submission Details</h2>
              <button onClick={() => setSelectedSubmission(null)} className="p-1 hover:bg-[#EAECEF] rounded-full transition-colors">
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(FIELD_CONFIG).map(([key, config]) => (
                  <div key={key}>
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">{config.label}</p>
                    <p className="text-sm font-medium text-[#1F2937]">
                      {String(selectedSubmission.candidateData[key as keyof CandidateData])}
                    </p>
                  </div>
                ))}
              </div>
              
              {selectedSubmission.exceptions.length > 0 && (
                <div className="pt-4 border-t border-[#EAECEF] space-y-3">
                  <h3 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Exceptions & Rationales</h3>
                  {selectedSubmission.exceptions.map((ex, i) => (
                    <div key={i} className="bg-soft-bg/20 p-3 rounded-lg border border-soft-border/30">
                      <p className="text-xs font-bold text-soft-text uppercase mb-1">{FIELD_CONFIG[ex.field].label}</p>
                      <p className="text-sm text-[#4B5563] italic">"{ex.rationale}"</p>
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
