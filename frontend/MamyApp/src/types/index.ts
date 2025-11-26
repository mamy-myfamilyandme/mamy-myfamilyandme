// 공통 타입 정의

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Prescription {
  id: string;
  imageUrl: string;
  ocrText: string;
  date: Date;
}

export interface HealthData {
  steps: number;
  heartRate: number;
  date: Date;
}
