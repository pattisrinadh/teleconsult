import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle,
  Video,
  MessageSquare,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { dataService } from '../services/dataService';
import { Metrics, Appointment, Patient } from '../types';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const m = await dataService.getStats();
      const a = await dataService.getAppointments('today');
      const p = await dataService.getPatients();
      setMetrics(m);
      setAppointments(a.slice(0, 4)); // Show recent 4
      setPatients(p);
    };
    fetchData();
  }, []);

  if (!metrics) return <div>Loading...</div>;

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Unknown';
  const getPatientDetails = (id: string) => patients.find(p => p.id === id);

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI 
          title="Today's Appointments" 
          value={metrics.todayAppointments} 
          icon={Calendar} 
          trend="+12% vs last week"
          color="bg-blue-500"
        />
        <KPI 
          title="Active Consults" 
          value={metrics.activeConsults} 
          icon={Video} 
          trend="Currently Live"
          color="bg-green-500"
        />
        <KPI 
          title="Avg. Wait Time" 
          value={`${metrics.avgWaitMins}m`} 
          icon={Clock} 
          trend="-2m vs yesterday"
          color="bg-amber-500"
        />
        <KPI 
          title="No Shows" 
          value={metrics.noShows} 
          icon={AlertCircle} 
          trend="1 cancelled"
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Live Queue</h2>
            <Link to="/appointments" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
          </div>
          
          <div className="space-y-4">
            {appointments.map((apt) => {
               const patient = getPatientDetails(apt.patientId);
               return (
                <GlassCard key={apt.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={patient?.avatarUrl} 
                        alt="Avatar" 
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        apt.status === 'in-progress' ? 'bg-green-500' : 
                        apt.status === 'waiting' ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{patient?.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        {apt.mode === 'video' ? <Video size={14} /> : <MessageSquare size={14} />}
                        {new Date(apt.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                      apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      apt.status === 'in-progress' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                    
                    {apt.status === 'waiting' || apt.status === 'in-progress' ? (
                       <Link 
                        to={`/room/${apt.id}`}
                        className="flex-1 md:flex-none text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                       >
                         {apt.status === 'in-progress' ? 'Rejoin' : 'Start Call'}
                       </Link>
                    ) : (
                      <button className="flex-1 md:flex-none px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg border border-slate-200 transition-colors">
                        Details
                      </button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
          <GlassCard className="space-y-3">
             <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                   <Calendar size={20} />
                 </div>
                 <span className="font-medium text-slate-700">New Appointment</span>
               </div>
               <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
             </button>
             
             <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                   <Users size={20} />
                 </div>
                 <span className="font-medium text-slate-700">Add Patient</span>
               </div>
               <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
             </button>

             <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                   <FileText size={20} />
                 </div>
                 <span className="font-medium text-slate-700">Generate Report</span>
               </div>
               <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
             </button>
          </GlassCard>

          <h2 className="text-xl font-bold text-slate-800 mt-8">Updates</h2>
          <GlassCard>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-3 items-start pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700">Lab results available for <span className="font-semibold">Ramesh Kumar</span></p>
                    <p className="text-xs text-slate-400 mt-1">10 mins ago</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const KPI = ({ title, value, icon: Icon, trend, color }: any) => (
  <GlassCard padding="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl text-white shadow-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-xs font-medium text-slate-500">{trend}</p>
    </div>
  </GlassCard>
);

export default Dashboard;