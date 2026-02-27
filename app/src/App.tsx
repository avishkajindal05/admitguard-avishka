import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdmissionForm from './views/AdmissionForm';
import AuditLog from './views/AuditLog';
import Dashboard from './views/Dashboard';
import { AppProvider, useAppContext } from './context/AppContext';

const AppContent: React.FC = () => {
  const { currentView } = useAppContext();

  const renderView = () => {
    switch (currentView) {
      case 'admission-form':
        return <AdmissionForm />;
      case 'audit-log':
        return <AuditLog />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <AdmissionForm />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FB] dark:bg-[#0F172A] transition-colors duration-300">
      <Sidebar />
      
      <div className="flex-1 ml-60 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
