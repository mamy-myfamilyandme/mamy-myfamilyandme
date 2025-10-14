/**
 * MAMMY 앱 색상 팔레트
 *
 * Primary: 민트/청록색 (Teal) - 메인 색상
 * Accent: 코랄 핑크 (Coral Pink) - 포인트 색상
 */

export const colors = {
  // Primary Colors - 민트/청록색 계열 (메인)
  primary: {
    main: '#6FCCBD',      // 민트 그린
    light: '#8FD9CD',     // 밝은 민트
    dark: '#4DB3A3',      // 진한 민트
    pale: '#A8E6DC',      // 연한 민트
  },

  // Accent Colors - 코랄 핑크 (포인트)
  accent: {
    main: '#FF8B7B',      // 코랄 핑크
    light: '#FFB5A8',     // 밝은 코랄
    dark: '#E67368',      // 진한 코랄
  },

  // Secondary Colors - 보조 색상
  secondary: {
    blue: '#3D7EBF',      // 블루
    lightBlue: '#5B9BD5', // 라이트 블루
    navy: '#2C3E50',      // 네이비
    darkBlue: '#1A2332',  // 다크 블루
    gray: '#B4BCC4',      // 그레이
  },

  // Neutral Colors - 중립 색상
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F8FAFC',
    lightGray: '#E2E8F0',
    gray: '#94A3B8',
    darkGray: '#475569',
    charcoal: '#1E293B',
    black: '#0F172A',
  },

  // Semantic Colors - 의미 색상
  semantic: {
    success: '#6FCCBD',   // 민트 (성공)
    error: '#FF8B7B',     // 코랄 (에러)
    warning: '#FFB84D',   // 오렌지 (경고)
    info: '#5B9BD5',      // 블루 (정보)
  },

  // Background Colors
  background: {
    primary: '#F8FAFC',   // 메인 배경
    secondary: '#FFFFFF', // 카드/컨텐츠 배경
    accent: '#EEF9F7',    // 액센트 배경 (민트 톤)
  },

  // Text Colors
  text: {
    primary: '#0F172A',   // 주요 텍스트
    secondary: '#475569', // 보조 텍스트
    disabled: '#94A3B8',  // 비활성 텍스트
    inverse: '#FFFFFF',   // 반전 텍스트 (어두운 배경용)
  },

  // Border Colors
  border: {
    light: '#E2E8F0',
    default: '#CBD5E1',
    dark: '#94A3B8',
  },
} as const;

// 타입 추출
export type Colors = typeof colors;
export type ColorKey = keyof Colors;
