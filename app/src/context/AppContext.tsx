import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Submission, DashboardMetrics } from '../types';
import { loadAuditLog, saveAuditEntry, clearAuditLog } from '../utils/auditStorage';

interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
  clearSubmissions: () => void;
  metrics: DashboardMetrics;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('admission-form');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setSubmissions(loadAuditLog());
  }, []);

  const addSubmission = (submission: Submission) => {
    setSubmissions(prev => {
      const next = [submission, ...prev];
      localStorage.setItem('admitguard_audit_log', JSON.stringify(next));
      return next;
    });
  };

  const clearSubmissions = () => {
    setSubmissions([]);
    clearAuditLog();
  };

  const metrics: DashboardMetrics = {
    totalSubmissions: submissions.length,
    totalExceptions: submissions.reduce((acc, s) => acc + s.exceptionCount, 0),
    exceptionRate: submissions.length > 0 
      ? (submissions.filter(s => s.exceptionCount > 0).length / submissions.length) * 100 
      : 0,
    flaggedEntries: submissions.filter(s => s.flagged).length,
  };

  return (
    <AppContext.Provider value={{ currentView, setCurrentView, submissions, addSubmission, clearSubmissions, metrics }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
