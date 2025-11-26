// API 호출 기본 설정

const API_BASE_URL = 'http://localhost:8000/api'; // 백엔드 주소로 변경 예정

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export const apiClient = {
  get: async <T = unknown>(endpoint: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },
  
  post: async <T = unknown>(endpoint: string, data: unknown): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
