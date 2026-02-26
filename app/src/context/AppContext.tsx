import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Submission, DashboardMetrics } from '../types';

interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
  metrics: DashboardMetrics;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('admission-form');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('admitguard_submissions');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse submissions', e);
      }
    }
  }, []);

  // Save to localStorage when submissions change
  useEffect(() => {
    localStorage.setItem('admitguard_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const addSubmission = (submission: Submission) => {
    setSubmissions(prev => [submission, ...prev]);
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
    <AppContext.Provider value={{ currentView, setCurrentView, submissions, addSubmission, metrics }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
