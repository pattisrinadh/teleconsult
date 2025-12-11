import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  providers: [
    { id: "p1", name: "Dr. Asha Rao", specialty: "General Medicine", location: "Hyderabad" },
    { id: "p2", name: "Dr. Vikram Patel", specialty: "Cardiology", location: "Bengaluru" }
  ],
  patients: [
    { id: "u1", name: "Ramesh Kumar", age: 42, gender: "M", phone: "9876543210", last_visit: "2025-12-05", allergies: ["Penicillin"], notes: "Hypertension history. Monitor BP.", avatarUrl: "https://picsum.photos/200/200?random=1" },
    { id: "u2", name: "Sita Devi", age: 29, gender: "F", phone: "9123456780", last_visit: "2025-12-10", allergies: [], notes: "Routine Follow-up", avatarUrl: "https://picsum.photos/200/200?random=2" },
    { id: "u3", name: "Amit Singh", age: 55, gender: "M", phone: "9988776655", last_visit: "2025-11-20", allergies: ["Sulfa"], notes: "Diabetic Type 2", avatarUrl: "https://picsum.photos/200/200?random=3" },
    { id: "u4", name: "Priya Sharma", age: 34, gender: "F", phone: "9911223344", last_visit: "2025-12-01", allergies: [], notes: "Migraine consult", avatarUrl: "https://picsum.photos/200/200?random=4" }
  ],
  appointments: [
    { id: "a1", patientId: "u1", providerId: "p1", start: "2025-12-11T10:00:00+05:30", end: "2025-12-11T10:20:00+05:30", status: "waiting", mode: "video" },
    { id: "a2", patientId: "u2", providerId: "p2", start: "2025-12-11T11:00:00+05:30", end: "2025-12-11T11:15:00+05:30", status: "confirmed", mode: "chat" },
    { id: "a3", patientId: "u3", providerId: "p1", start: "2025-12-11T09:30:00+05:30", end: "2025-12-11T09:45:00+05:30", status: "completed", mode: "video" },
    { id: "a4", patientId: "u4", providerId: "p1", start: "2025-12-11T12:00:00+05:30", end: "2025-12-11T12:30:00+05:30", status: "confirmed", mode: "video" }
  ],
  metrics: {
    todayAppointments: 12,
    activeConsults: 2,
    avgWaitMins: 7,
    noShows: 1
  },
  prescriptions: [
    { id: "r1", patientId: "u1", providerId: "p1", date: "2025-12-05", medicines: [{ name: "Amlodipine", dose: "5mg", freq: "Once daily" }], notes: "Check BP in 2 weeks" }
  ]
};