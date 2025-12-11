import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock, Video, MessageSquare } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { dataService } from '../services/dataService';
import { Appointment, Patient } from '../types';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    Promise.all([
      dataService.getAppointments(),
      dataService.getPatients()
    ]).then(([a, p]) => {
      setAppointments(a);
      setPatients(p);
    });
  }, []);

  const getPatient = (id: string) => patients.find(p => p.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 bg-white/40 p-1.5 rounded-xl border border-white/40">
           <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronLeft size={20} /></button>
           <span className="font-semibold text-slate-800 min-w-[140px] text-center">December 2025</span>
           <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={20} /></button>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white/60 text-slate-600 font-medium rounded-lg hover:bg-white transition-colors">Day</button>
           <button className="px-4 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg">Week</button>
           <button className="px-4 py-2 bg-white/60 text-slate-600 font-medium rounded-lg hover:bg-white transition-colors">Month</button>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors">
          <Plus size={18} />
          <span>New Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Calendar Grid (Simplified for prototype) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="min-h-[600px] relative">
            <div className="flex justify-between border-b border-slate-100 pb-4 mb-4">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                 <div key={d} className="text-center w-full font-medium text-slate-500">{d}</div>
               ))}
            </div>
            
            {/* Time Slots */}
            <div className="space-y-6">
              {[9, 10, 11, 12, 1, 2, 3, 4].map(hour => (
                <div key={hour} className="flex group">
                   <div className="w-16 text-right pr-4 text-xs text-slate-400 -mt-2.5">
                     {hour > 12 ? hour - 12 : hour} {hour >= 12 && hour !== 12 ? 'PM' : 'AM'}
                   </div>
                   <div className="flex-1 border-t border-slate-100 relative h-20 group-hover:bg-slate-50/50 transition-colors">
                      {appointments.filter(a => {
                        const d = new Date(a.start);
                        return d.getHours() === (hour < 9 ? hour + 12 : hour) || (hour === 1 && d.getHours() === 13) || (hour === 2 && d.getHours() === 14) || (hour === 3 && d.getHours() === 15) || (hour === 4 && d.getHours() === 16);
                      }).map(apt => {
                        const p = getPatient(apt.patientId);
                        return (
                          <div 
                            key={apt.id} 
                            className={`absolute top-2 left-2 right-4 p-3 rounded-lg border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                              apt.status === 'confirmed' ? 'bg-blue-50 border-blue-500' : 
                              apt.status === 'waiting' ? 'bg-amber-50 border-amber-500' : 'bg-green-50 border-green-500'
                            }`}
                          >
                             <div className="flex justify-between items-start">
                               <div>
                                 <p className="font-semibold text-sm text-slate-800">{p?.name}</p>
                                 <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                   {apt.mode === 'video' ? <Video size={10} /> : <MessageSquare size={10} />}
                                   {apt.mode.toUpperCase()}
                                 </p>
                               </div>
                               <span className="text-xs font-medium text-slate-500">
                                 {new Date(apt.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </span>
                             </div>
                          </div>
                        )
                      })}
                   </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick List / Availability */}
        <div className="lg:col-span-2 space-y-6">
           <GlassCard>
             <h3 className="font-bold text-slate-800 mb-4">Availability Stats</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-100">
                  <span className="text-sm font-medium text-green-700">Available Slots</span>
                  <span className="text-lg font-bold text-green-800">4</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-sm font-medium text-blue-700">Confirmed</span>
                  <span className="text-lg font-bold text-blue-800">8</span>
                </div>
             </div>
           </GlassCard>
           
           <GlassCard>
             <h3 className="font-bold text-slate-800 mb-4">Upcoming</h3>
             <div className="space-y-4">
                {appointments.slice(0,3).map(apt => (
                  <div key={apt.id} className="flex gap-3 items-center">
                     <div className="w-12 h-12 rounded-xl bg-primary-100 flex flex-col items-center justify-center text-primary-700 font-bold leading-none">
                       <span className="text-sm">{new Date(apt.start).getDate()}</span>
                       <span className="text-[10px] uppercase">Dec</span>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-800">{getPatient(apt.patientId)?.name}</p>
                       <p className="text-xs text-slate-500">
                         {new Date(apt.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </p>
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

export default Appointments;