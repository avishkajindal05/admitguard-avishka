import React from 'react';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';
import { Users, AlertTriangle, Percent, ShieldAlert, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { metrics } = useAppContext();

  const stats = [
    { label: 'Total Submissions', value: metrics.totalSubmissions, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Exceptions', value: metrics.totalExceptions, icon: AlertTriangle, color: 'text-soft-text', bg: 'bg-soft-bg/20' },
    { label: 'Exception Rate', value: `${metrics.exceptionRate.toFixed(1)}%`, icon: Percent, color: 'text-[#4B5563]', bg: 'bg-[#F3F4F6]' },
    { label: 'Flagged Entries', value: metrics.flaggedEntries, icon: ShieldAlert, color: 'text-flagged-text', bg: 'bg-flagged-bg/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard Overview</h1>
        <div className="text-sm text-[#9CA3AF] font-medium">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#1F2937]">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Enrollment Trends" subtitle="Submission volume over the last 7 days.">
          <div className="h-64 flex flex-col items-center justify-center text-[#9CA3AF] border-2 border-dashed border-[#EAECEF] rounded-xl">
            <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm font-medium">Visualization shell — Recharts integration pending</p>
          </div>
        </Card>

        <Card title="Exception Distribution" subtitle="Breakdown by field type.">
          <div className="space-y-4">
            {['Qualification', 'Graduation Year', 'Test Score', 'Age'].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-[#4B5563]">{item}</span>
                  <span className="text-[#9CA3AF]">{Math.floor(Math.random() * 40 + 10)}%</span>
                </div>
                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-soft-border rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 40 + 10)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
