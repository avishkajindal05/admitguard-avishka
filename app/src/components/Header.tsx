import React, { useState, useRef } from 'react';
import { Bell, User, Search, Sun, Moon, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, searchQuery, setSearchQuery, submissions, setCurrentView } = useAppContext();
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredSubmissions = submissions
    .filter(s => 
      s.candidateData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.candidateData.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 6);

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-[#EAECEF] dark:border-[#334155] flex items-center justify-between px-6 sticky top-0 z-50 w-full">
      <div className="relative flex items-center gap-4 bg-[#F8F9FB] dark:bg-[#0F172A] px-4 py-2 rounded-lg w-96 border border-[#EAECEF] dark:border-[#334155]">
        <Search className="w-4 h-4 text-[#9CA3AF] dark:text-[#64748B]" />
        <input 
          ref={searchInputRef}
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Search candidates, logs..." 
          className="bg-transparent border-none outline-none text-sm w-full text-[#1F2937] dark:text-[#F1F5F9] placeholder:text-[#9CA3AF] dark:placeholder:text-[#64748B]"
        />
        {searchQuery && (
          <button 
            onClick={handleClearSearch}
            className="absolute right-3 text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-[#F1F5F9]"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {isFocused && searchQuery.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-[#1E293B] rounded-xl border border-[#EAECEF] dark:border-[#334155] shadow-xl z-50 max-h-80 overflow-y-auto">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((s) => (
                <div 
                  key={s.id}
                  className="px-4 py-3 hover:bg-[#F8F9FB] dark:hover:bg-[#334155]/30 cursor-pointer flex items-center justify-between border-b border-[#EAECEF] dark:border-[#334155] last:border-0"
                  onMouseDown={() => { 
                    setCurrentView('audit-log'); 
                    setSearchQuery(''); 
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F9]">
                      {s.candidateData.fullName}
                    </p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#64748B]">
                      {s.candidateData.email} · {format(new Date(s.timestamp), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.flagged && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-flagged-bg text-flagged-text">
                        FLAGGED
                      </span>
                    )}
                    <span className="text-xs text-[#9CA3AF] dark:text-[#64748B]">{s.exceptionCount} exc</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-[#9CA3AF] dark:text-[#64748B]">
                No candidates found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1F2937] dark:hover:text-[#F1F5F9] transition-all"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1F2937] dark:hover:text-[#F1F5F9] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-strict-text rounded-full border-2 border-white dark:border-[#1E293B]" />
        </button>
        
        <div className="h-8 w-[1px] bg-[#EAECEF] dark:bg-[#334155]" />
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <div className="text-sm font-medium text-[#1F2937] dark:text-[#F1F5F9]">Admissions Ops</div>
            <div className="text-[11px] text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-wider">Admin Access</div>
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
