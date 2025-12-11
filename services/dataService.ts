import { INITIAL_DATA } from '../constants';
import { AppData, Appointment, Patient, Prescription } from '../types';

// In a real app, this would be an API client.
// Here we use a closure to hold state in memory for the prototype session.

let state: AppData = { ...INITIAL_DATA };

export const dataService = {
  getStats: () => Promise.resolve(state.metrics),
  
  getPatients: (query: string = '') => {
    return Promise.resolve(
      state.patients.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.phone.includes(query)
      )
    );
  },

  getPatientById: (id: string) => {
    return Promise.resolve(state.patients.find(p => p.id === id));
  },

  getAppointments: (filter?: 'today' | 'upcoming' | 'history') => {
    // For prototype, we just return all, maybe sorted.
    // In a real app, logic would filter by date.
    return Promise.resolve(state.appointments.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
  },

  getAppointmentById: (id: string) => {
    return Promise.resolve(state.appointments.find(a => a.id === id));
  },

  updateAppointmentStatus: (id: string, status: Appointment['status']) => {
    state.appointments = state.appointments.map(a => 
      a.id === id ? { ...a, status } : a
    );
    return Promise.resolve(true);
  },

  addPrescription: (prescription: Prescription) => {
    state.prescriptions.push(prescription);
    return Promise.resolve(prescription);
  },

  getPrescriptionsForPatient: (patientId: string) => {
    return Promise.resolve(state.prescriptions.filter(p => p.patientId === patientId));
  }
};