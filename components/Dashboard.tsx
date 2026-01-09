
import React, { useMemo } from 'react';
import { Resident, Gender, ResidentStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface DashboardProps {
  residents: Resident[];
}

const Dashboard: React.FC<DashboardProps> = ({ residents }) => {
  const totalResidents = residents.length;
  const maleCount = residents.filter(r => r.gender === Gender.MALE).length;
  const femaleCount = residents.filter(r => r.gender === Gender.FEMALE).length;
  const deceasedCount = residents.filter(r => r.status === ResidentStatus.DECEASED).length;

  const genderData = [
    { name: 'Laki-laki', value: maleCount },
    { name: 'Perempuan', value: femaleCount }
  ];

  const trendData = useMemo(() => {
    const sorted = [...residents].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const dataPoints: any[] = [];
    let count = 0;
    let deadCount = 0;

    sorted.forEach(r => {
      count++;
      if (r.status === ResidentStatus.DECEASED) deadCount++;
      dataPoints.push({
        time: new Date(r.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        population: count,
        mortality: deadCount
      });
    });

    return dataPoints;
  }, [residents]);

  const COLORS = ['#0f172a', '#64748b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Brand Header */}
      <div className="bg-[#0f172a] p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-800/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-serif text-white tracking-tight">Desa Parungkamal</h1>
          <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px] mt-2">Sistem Informasi Pendataan Terpadu</p>
          <div className="mt-10 flex gap-4">
            <div className="px-5 py-2 bg-slate-800 rounded-2xl text-slate-300 text-[10px] font-black tracking-widest border border-slate-700">VERSION 2.0 PRO</div>
            <div className="px-5 py-2 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[10px] font-black tracking-widest border border-emerald-500/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              LIVE DATABASE
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Populasi Total', val: totalResidents, color: 'text-slate-900', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7' },
          { label: 'Penduduk Wanita', val: femaleCount, color: 'text-slate-700', icon: 'M12 4.354a4 4 0 110 5.292' },
          { label: 'Penduduk Pria', val: maleCount, color: 'text-slate-700', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' },
          { label: 'Angka Kematian', val: deceasedCount, color: 'text-red-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
              <svg className={`w-5 h-5 ${item.color} opacity-20`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
            </div>
            <h3 className={`text-4xl font-black mt-6 ${item.color}`}>{item.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Style Trend Chart */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-xl font-black text-slate-900">Dinamika Populasi</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Trading Trend Analysis</p>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="population" 
                  stroke="#0f172a" 
                  strokeWidth={4} 
                  fill="url(#popGradient)" 
                  dot={{ r: 5, fill: '#0f172a', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                  name="Total"
                />
                <Area 
                  type="monotone" 
                  dataKey="mortality" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  fill="transparent" 
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                  name="Kematian"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 lg:col-span-1">
          <h4 className="text-xl font-black text-slate-900 mb-10">Distribusi Gender</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value">
                  {genderData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
