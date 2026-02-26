import React from 'react';
import { LayoutDashboard, FileText, History, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { View } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext();

  const navItems: { id: View; label: string; icon: React.ElementType }[] = [
    { id: 'admission-form', label: 'Admission Form', icon: FileText },
    { id: 'audit-log', label: 'Audit Log', icon: History },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-60 bg-[#F8F9FB] border-r border-[#EAECEF] h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 flex items-center gap-2 mb-4">
        <ShieldCheck className="text-primary w-8 h-8" />
        <span className="font-semibold text-xl tracking-tight text-[#1F2937]">AdmitGuard</span>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-white shadow-sm border border-[#EAECEF] text-primary font-medium" 
                  : "text-[#4B5563] hover:bg-white/50 hover:text-[#1F2937]"
              )}
            >
              <div className={cn(
                "w-1 h-5 rounded-full absolute left-0 transition-opacity",
                isActive ? "bg-primary opacity-100" : "opacity-0"
              )} />
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-[#9CA3AF] group-hover:text-[#4B5563]")} />
              <span className="text-[15px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[#EAECEF]">
        <div className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-2">System Status</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success-text animate-pulse" />
          <span className="text-sm text-[#4B5563]">Live Validation Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
