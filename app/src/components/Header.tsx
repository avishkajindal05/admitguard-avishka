import React from 'react';
import { Bell, User, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border border-[#EAECEF] flex items-center justify-between px-6 fixed top-4 right-8 left-[272px] z-10 rounded-2xl shadow-lg shadow-black/5">
      <div className="flex items-center gap-4 bg-[#F8F9FB] px-4 py-2 rounded-lg w-96 border border-[#EAECEF]">
        <Search className="w-4 h-4 text-[#9CA3AF]" />
        <input 
          type="text" 
          placeholder="Search candidates, logs..." 
          className="bg-transparent border-none outline-none text-sm w-full text-[#1F2937] placeholder:text-[#9CA3AF]"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-[#4B5563] hover:text-[#1F2937] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-strict-text rounded-full border-2 border-white" />
        </button>
        
        <div className="h-8 w-[1px] bg-[#EAECEF]" />
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <div className="text-sm font-medium text-[#1F2937]">Admissions Ops</div>
            <div className="text-[11px] text-[#9CA3AF] uppercase tracking-wider">Admin Access</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
