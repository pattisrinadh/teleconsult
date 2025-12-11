import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Calendar, AlertTriangle, FileText, X } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { dataService } from '../services/dataService';
import { Patient } from '../types';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(async () => {
      const results = await dataService.getPatients(query);
      setPatients(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, phone..."
            className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:ring-2 ring-primary-500 outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors">
          Add New Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <GlassCard 
            key={patient.id} 
            className="cursor-pointer group hover:bg-white/80"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-start gap-4">
              <img 
                src={patient.avatarUrl} 
                alt={patient.name} 
                className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
              />
              <div>
                <h3 className="text-lg font-bold text-slate-800">{patient.name}</h3>
                <p className="text-slate-500 text-sm">{patient.gender}, {patient.age} years</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <Phone size={12} />
                  {patient.phone}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="text-slate-500">Last Visit</span>
              <span className="font-medium text-slate-700">{new Date(patient.last_visit).toLocaleDateString()}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Patient Detail Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
          <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X size={24} />
            </button>

            <div className="mt-8 text-center">
              <img 
                src={selectedPatient.avatarUrl} 
                alt={selectedPatient.name} 
                className="w-24 h-24 rounded-full mx-auto shadow-lg ring-4 ring-white"
              />
              <h2 className="text-2xl font-bold text-slate-800 mt-4">{selectedPatient.name}</h2>
              <p className="text-slate-500">{selectedPatient.gender} • {selectedPatient.age} years old</p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/50 rounded-xl border border-white/50">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Blood Group</p>
                   <p className="text-lg font-semibold text-slate-800">O+</p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl border border-white/50">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Weight</p>
                   <p className="text-lg font-semibold text-slate-800">72 kg</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Allergies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.allergies.length > 0 ? (
                    selectedPatient.allergies.map(a => (
                      <span key={a} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">No known allergies</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={18} className="text-primary-500" />
                  Medical Notes
                </h3>
                <div className="p-4 bg-yellow-50/80 border border-yellow-100 rounded-xl text-sm text-slate-700 leading-relaxed">
                  {selectedPatient.notes}
                </div>
              </div>
              
               <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={18} className="text-primary-500" />
                  History
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold text-xs">
                      DEC
                      <br/>05
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">General Checkup</p>
                      <p className="text-xs text-slate-500">Dr. Asha Rao</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary-500/20">
                  Start Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;