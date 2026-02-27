import React, { useMemo } from 'react';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';
import { Users, AlertTriangle, Percent, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

const Dashboard: React.FC = () => {
  const { metrics, submissions } = useAppContext();

  const stats = [
    { label: 'Total Submissions', value: metrics.totalSubmissions, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Exceptions', value: metrics.totalExceptions, icon: AlertTriangle, color: 'text-soft-text', bg: 'bg-soft-bg/20' },
    { label: 'Exception Rate', value: `${metrics.exceptionRate.toFixed(1)}%`, icon: Percent, color: 'text-[#4B5563]', bg: 'bg-[#F3F4F6]' },
    { label: 'Flagged Entries', value: metrics.flaggedEntries, icon: ShieldAlert, color: 'text-flagged-text', bg: 'bg-flagged-bg/20' },
  ];

  // FIX 1: Exception Distribution
  const exceptionDistribution = useMemo(() => {
    const fields = [
      { id: 'dob', label: 'Date of Birth' },
      { id: 'graduationYear', label: 'Graduation Year' },
      { id: 'percentageOrCgpa', label: 'Score / CGPA' },
      { id: 'screeningScore', label: 'Screening Score' },
    ];

    const total = submissions.length;
    const counts = fields.map(field => {
      const count = submissions.reduce((acc, sub) => {
        const hasException = sub.exceptions.some(ex => ex.field === field.id);
        return acc + (hasException ? 1 : 0);
      }, 0);
      return { ...field, count };
    });

    const maxCount = Math.max(...counts.map(c => c.count));
    
    return counts.map(c => ({
      ...c,
      percentage: total > 0 ? ((c.count / total) * 100).toFixed(1) : '0.0',
      barWidth: maxCount > 0 ? (c.count / maxCount) * 100 : 0
    }));
  }, [submissions]);

  // FIX 2: Enrollment Trends
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date,
        name: format(date, 'EEE'),
        count: submissions.filter(s => isSameDay(startOfDay(new Date(s.timestamp)), startOfDay(date))).length
      };
    });
    return days;
  }, [submissions]);

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
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECEF" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#F8F9FB' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#2563EB" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Exception Distribution" subtitle="Breakdown by field type.">
          <div className="space-y-6">
            {exceptionDistribution.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-[#1F2937]">{item.count} <span className="text-[#9CA3AF] font-medium">Entries</span></p>
                  </div>
                  <span className="text-xs font-bold text-primary">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${item.barWidth}%` }} 
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
