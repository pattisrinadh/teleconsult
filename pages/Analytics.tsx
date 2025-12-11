import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import GlassCard from '../components/GlassCard';

const Analytics: React.FC = () => {
  
  const visitData = [
    { name: 'Mon', visits: 12 },
    { name: 'Tue', visits: 19 },
    { name: 'Wed', visits: 15 },
    { name: 'Thu', visits: 22 },
    { name: 'Fri', visits: 28 },
    { name: 'Sat', visits: 10 },
  ];

  const specialtyData = [
    { name: 'General', value: 45 },
    { name: 'Cardio', value: 25 },
    { name: 'Neuro', value: 20 },
    { name: 'Ortho', value: 10 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-slate-800">Performance Analytics</h2>
         <select className="bg-white/50 border border-white/40 rounded-lg px-4 py-2 text-sm outline-none text-slate-600">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
         </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <GlassCard className="h-80">
            <h3 className="font-bold text-slate-700 mb-6">Consultation Volume</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
         </GlassCard>

         <GlassCard className="h-80">
            <h3 className="font-bold text-slate-700 mb-6">Patient Satisfaction Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
         </GlassCard>

         <GlassCard className="h-80">
            <h3 className="font-bold text-slate-700 mb-6">Visits by Specialty</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
         </GlassCard>
         
         <GlassCard className="h-80 flex flex-col justify-center items-center text-center p-8">
            <div className="w-24 h-24 rounded-full border-8 border-green-100 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-green-600">4.8</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Average Rating</h3>
            <p className="text-slate-500 mt-2">Based on 124 post-consultation reviews this month.</p>
         </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;