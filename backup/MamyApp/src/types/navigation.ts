export type TabScreen = 'home' | 'medication' | 'vaccination' | 'hospital' | 'health' | 'community';

export interface Child {
  id: string;
  name: string;
  birthDate: string;
  photoUrl?: string;
}

export interface VaccinationRecord {
  id: string;
  childId: string;
  vaccineName: string;
  date: string;
  completed: boolean;
}

export interface MedicationSchedule {
  id: string;
  childId: string;
  medicationName: string;
  dosage: string;
  time: string;
  frequency: string;
}

export interface HospitalAppointment {
  id: string;
  childId: string;
  hospitalName: string;
  department: string;
  date: string;
  time: string;
  reason?: string;
}

export interface HealthRecord {
  id: string;
  childId: string;
  date: string;
  type: 'temperature' | 'weight' | 'height' | 'symptom' | 'note';
  value: string;
  note?: string;
}

export interface CommunityPost {
  id: string;
  type: 'news' | 'column';
  title: string;
  author: string;
  date: string;
  thumbnail?: string;
  excerpt: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
}
