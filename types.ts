export interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  phone: string;
  last_visit: string;
  allergies: string[];
  notes: string;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  start: string; // ISO String
  end: string; // ISO String
  status: 'waiting' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  mode: 'video' | 'chat' | 'audio';
}

export interface Medicine {
  name: string;
  dose: string;
  freq: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  medicines: Medicine[];
  notes: string;
}

export interface Metrics {
  todayAppointments: number;
  activeConsults: number;
  avgWaitMins: number;
  noShows: number;
}

export interface AppData {
  providers: Provider[];
  patients: Patient[];
  appointments: Appointment[];
  metrics: Metrics;
  prescriptions: Prescription[];
}