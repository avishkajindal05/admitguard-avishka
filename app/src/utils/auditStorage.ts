import { Submission } from '../types';

const STORAGE_KEY = 'admitguard_audit_log';

export const loadAuditLog = (): Submission[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse audit log', e);
    return [];
  }
};

export const saveAuditLog = (logs: Submission[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

export const saveAuditEntry = (entry: Submission): void => {
  const logs = loadAuditLog();
  const updatedLogs = [entry, ...logs];
  saveAuditLog(updatedLogs);
};

export const clearAuditLog = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
