/**
 * API 서비스 레이어
 * 백엔드 API와 통신하는 모든 함수를 관리
 */

import type { SignupData, ChildInfo } from '../types/auth';
import type { VaccinationSchedule, VaccinationStats } from '../types/vaccination';

// API Base URL (개발 환경)
const API_BASE_URL = 'http://localhost:8000/api';

// API 응답 타입
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface SignupResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    user_mode: string;
    created_at: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    user_mode: string;
    created_at: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

/**
 * API 요청 헬퍼 함수
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || data.detail || '요청에 실패했습니다.',
      };
    }

    return { data };
  } catch (error) {
    console.error('API 요청 오류:', error);
    return {
      error: '네트워크 오류가 발생했습니다. 서버 연결을 확인해주세요.',
    };
  }
}

/**
 * 회원가입 API
 */
export async function signup(
  signupData: SignupData
): Promise<ApiResponse<SignupResponse>> {
  const payload: any = {
    email: signupData.email,
    password: signupData.password,
    confirm_password: signupData.confirmPassword,
    name: signupData.name,
    user_mode: signupData.userMode,
  };

  // 보호자 모드인 경우 아이 정보 추가
  if (signupData.userMode === 'caregiver' && signupData.childInfo) {
    payload.child_info = {
      name: signupData.childInfo.name,
      birth_date: signupData.childInfo.birthDate,
      gender: signupData.childInfo.gender,
    };
  }

  return apiRequest<SignupResponse>('/accounts/signup/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * 로그인 API
 */
export async function login(
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<LoginResponse>('/accounts/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * 내 정보 조회 API (인증 필요)
 */
export async function getMe(
  accessToken: string
): Promise<ApiResponse<any>> {
  return apiRequest('/accounts/me/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * 토큰 저장 (AsyncStorage 사용)
 */
export async function saveTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage')
      .default;
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error('토큰 저장 오류:', error);
  }
}

/**
 * 토큰 가져오기
 */
export async function getTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage')
      .default;
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('토큰 가져오기 오류:', error);
    return { accessToken: null, refreshToken: null };
  }
}

/**
 * 로그아웃 (토큰 삭제)
 */
export async function logout(): Promise<void> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage')
      .default;
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
}

/**
 * 예방접종 일정 조회 API
 */
export async function getVaccinationSchedules(
  childId: number,
  accessToken: string
): Promise<ApiResponse<VaccinationSchedule[]>> {
  return apiRequest<VaccinationSchedule[]>(
    `/vaccinations/schedules/?child_id=${childId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * 예방접종 통계 조회 API
 */
export async function getVaccinationStats(
  childId: number,
  accessToken: string
): Promise<ApiResponse<VaccinationStats>> {
  return apiRequest<VaccinationStats>(
    `/vaccinations/stats/?child_id=${childId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * 다가오는 예방접종 조회 API
 */
export async function getUpcomingVaccinations(
  childId: number,
  accessToken: string,
  daysAhead: number = 60
): Promise<ApiResponse<VaccinationSchedule[]>> {
  return apiRequest<VaccinationSchedule[]>(
    `/vaccinations/upcoming/?child_id=${childId}&days_ahead=${daysAhead}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * 예방접종 완료 처리 API
 */
export async function markVaccinationComplete(
  scheduleId: number,
  completedDate: string,
  accessToken: string
): Promise<ApiResponse<VaccinationSchedule>> {
  return apiRequest<VaccinationSchedule>(
    `/vaccinations/schedules/${scheduleId}/complete/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ completed_date: completedDate }),
    }
  );
}
