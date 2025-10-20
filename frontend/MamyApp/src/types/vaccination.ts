/**
 * 예방접종 관련 타입 정의
 */

export interface VaccinationSchedule {
  id: number;
  vaccine_id: number;
  vaccine_name: string;
  disease: string;
  dose_number: number;
  age_description: string;
  vaccination_date: string;
  notification_date: string;
  is_completed: boolean;
  completed_date?: string;
  is_mandatory: boolean;
  is_annual: boolean;
  notes?: string;
  is_overdue?: boolean;
  is_upcoming?: boolean;
}

export interface VaccinationStats {
  total: number;
  completed: number;
  upcoming: number;
  overdue: number;
  completion_rate: number;
}
