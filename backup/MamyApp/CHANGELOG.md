# 개발 일지

## 2025년 10월 11일

### 📋 목차
1. [탭 네비게이션 시스템 구축](#1-탭-네비게이션-시스템-구축)
2. [벡터 아이콘 통합 및 UI 개선](#2-벡터-아이콘-통합-및-ui-개선)
3. [커뮤니티 기능 추가](#3-커뮤니티-기능-추가)
4. [주요 변경 파일](#4-주요-변경-파일)

---

## 1. 탭 네비게이션 시스템 구축

### 🎯 목표
대시보드에 5개의 주요 기능을 탭으로 구분하여 접근성 향상

### 📝 구현 내용

#### 1.1 네비게이션 타입 정의
**파일**: `src/types/navigation.ts`

```typescript
// 탭 화면 타입 정의
export type TabScreen = 'home' | 'medication' | 'vaccination' | 'hospital' | 'health';

// 각 기능별 데이터 인터페이스
export interface VaccinationRecord { ... }
export interface MedicationSchedule { ... }
export interface HospitalAppointment { ... }
export interface HealthRecord { ... }
```

**설명**:
- 앱의 5가지 주요 기능을 타입으로 정의
- TypeScript로 타입 안정성 확보
- 각 기능별 데이터 구조를 인터페이스로 명확히 정의

---

#### 1.2 탭 화면 컴포넌트 생성

##### 복약관리 화면 (`MedicationScreen.tsx`)
```typescript
export function MedicationScreen() {
  // 오늘 복용해야 할 약 목록 표시
  // 복용 시간별로 구분
  // 복용 완료 여부 체크
}
```

**주요 기능**:
- 오늘의 복약 일정 표시
- 시간대별 복약 알림 (아침/점심/저녁)
- 복용 완료 상태 관리

##### 예방접종 현황 화면 (`VaccinationScreen.tsx`)
```typescript
export function VaccinationScreen() {
  // 다가오는 접종 일정
  // 접종 완료율 (진행바)
  // 최근 접종 기록
}
```

**주요 기능**:
- 다가오는 접종 일정 알림
- 접종 완료율 시각화 (15/20 완료 - 75%)
- 접종 기록 추가 버튼
- 완료된 접종 이력

##### 병원 일정 화면 (`HospitalScreen.tsx`)
```typescript
export function HospitalScreen() {
  // 예정된 진료 일정
  // 병원명, 진료과, 시간 표시
}
```

**주요 기능**:
- 날짜 박스 UI로 시각적 강조
- 병원명, 진료과, 예약 시간 표시
- 지난 진료 기록 보관

##### 건강상태 기록 화면 (`HealthScreen.tsx`)
```typescript
export function HealthScreen() {
  // 최근 체온 기록
  // 성장 기록 (키, 몸무게)
  // 증상 기록
}
```

**주요 기능**:
- 체온 기록 및 정상 여부 표시
- 성장 기록 (키 95cm, 몸무게 14.5kg)
- 증상 히스토리 관리

---

#### 1.3 탭 네비게이션 바 컴포넌트
**파일**: `src/components/TabNavigator.tsx`

**초기 버전 (이모지 사용)**:
```typescript
const TABS: TabItem[] = [
  { id: 'home', label: '홈', icon: '🏠' },
  { id: 'medication', label: '복약', icon: '💊' },
  { id: 'vaccination', label: '접종', icon: '💉' },
  { id: 'hospital', label: '병원', icon: '🏥' },
  { id: 'health', label: '건강', icon: '❤️' },
];
```

**문제점**:
- 이모지 간 통일감 부족
- 디자인 일관성 저하
- 활성/비활성 상태 구분 어려움

---

#### 1.4 대시보드 업데이트 (보호자 모드 전용 기능)
**파일**: `src/screens/DashboardScreen.tsx`

**추가된 접종 카드 컴포넌트**:
```typescript
{userMode === 'caregiver' && (
  <View style={styles.vaccinationCard}>
    {/* 접종 현황 헤더 */}
    <View style={styles.vaccinationHeader}>
      <Text style={styles.vaccinationTitle}>🧒 우리 아이 접종 현황</Text>
      <View style={styles.completionBadge}>
        <Text style={styles.completionText}>75%</Text>
      </View>
    </View>

    {/* 진행바 */}
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '75%' }]} />
      </View>
      <Text style={styles.progressLabel}>15/20 완료</Text>
    </View>

    {/* 다가오는 접종 정보 */}
    <View style={styles.upcomingVaccination}>
      <Text style={styles.upcomingLabel}>다가오는 접종</Text>
      <Text style={styles.upcomingName}>MMR 2차</Text>
      <Text style={styles.upcomingDate}>2025년 10월 20일</Text>
    </View>

    {/* 빠른 접종 기록 버튼 */}
    <Pressable style={styles.quickRecordButton}>
      <Text style={styles.quickRecordText}>+ 접종 기록하기</Text>
    </Pressable>
  </View>
)}
```

**주요 특징**:
- **조건부 렌더링**: 보호자 모드에서만 표시
- **진행바 시각화**: 접종 완료율을 한눈에 파악
- **다가오는 일정 강조**: 놓치지 않도록 알림
- **빠른 액션**: 접종 기록 추가 버튼

---

#### 1.5 App.tsx 통합
**파일**: `App.tsx`

```typescript
function App() {
  const [activeTab, setActiveTab] = useState<TabScreen>('home');

  // 탭 화면 렌더링 함수
  const renderTabScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen userMode={selectedUserMode} onLogout={handleLogout} />;
      case 'medication':
        return <MedicationScreen />;
      case 'vaccination':
        return <VaccinationScreen />;
      case 'hospital':
        return <HospitalScreen />;
      case 'health':
        return <HealthScreen />;
      default:
        return <DashboardScreen userMode={selectedUserMode} onLogout={handleLogout} />;
    }
  };

  // 대시보드 렌더링 (화면 + 탭 네비게이션)
  return (
    <View style={styles.dashboardContainer}>
      {renderTabScreen()}
      <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}
```

**구조 설명**:
- `activeTab` 상태로 현재 활성 탭 관리
- `renderTabScreen()`으로 탭별 화면 전환
- 하단에 고정된 TabNavigator 배치
- 로그인 시 자동으로 'home' 탭으로 초기화

---

## 2. 벡터 아이콘 통합 및 UI 개선

### 🎯 목표
이모지 대신 통일된 디자인의 벡터 아이콘 사용으로 전문성 향상

### 📝 구현 내용

#### 2.1 react-native-vector-icons 설치
```bash
npm install react-native-vector-icons
npm install --save-dev @types/react-native-vector-icons
```

**선택 이유**:
- Ionicons, MaterialIcons 등 다양한 아이콘 세트 제공
- 완전 무료 오픈소스
- React Native에서 가장 널리 사용되는 아이콘 라이브러리
- outline/filled 스타일 지원

---

#### 2.2 iOS 설정
**파일**: `ios/MamyApp/Info.plist`

```xml
<key>UIAppFonts</key>
<array>
  <string>Ionicons.ttf</string>
  <string>MaterialIcons.ttf</string>
  <string>MaterialCommunityIcons.ttf</string>
</array>
```

**설명**:
- iOS에서 커스텀 폰트(아이콘) 사용 허용
- 3가지 주요 아이콘 세트 등록

**CocoaPods 재설치**:
```bash
cd ios && pod install
```

---

#### 2.3 TabNavigator 아이콘 업데이트
**파일**: `src/components/TabNavigator.tsx`

**변경 전**:
```typescript
const TABS: TabItem[] = [
  { id: 'home', label: '홈', icon: '🏠' },
  { id: 'medication', label: '복약', icon: '💊' },
  // ...
];

// 렌더링
<Text style={styles.icon}>{tab.icon}</Text>
```

**변경 후**:
```typescript
import Icon from 'react-native-vector-icons/Ionicons';

const TABS: TabItem[] = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'medication', label: '복약', icon: 'medical' },
  { id: 'vaccination', label: '접종', icon: 'shield-checkmark' },
  { id: 'hospital', label: '병원', icon: 'business' },
  { id: 'health', label: '건강', icon: 'heart' },
];

// 렌더링
<Icon
  name={isActive ? tab.icon : `${tab.icon}-outline`}
  size={24}
  color={isActive ? colors.primary.main : colors.text.secondary}
/>
```

**개선 효과**:
- ✅ 통일된 디자인 언어
- ✅ 활성/비활성 상태 명확한 구분 (filled/outline)
- ✅ 브랜드 컬러와 조화 (민트 그린 / 회색)
- ✅ 더 전문적인 UI

**아이콘 선택 기준**:
- `home`: 직관적인 홈 아이콘
- `medical`: 의료/약품을 상징하는 십자가
- `shield-checkmark`: 예방접종의 '보호'와 '완료' 의미
- `business`: 병원 건물을 상징
- `heart`: 건강/생명을 상징

---

## 3. 커뮤니티 기능 추가

### 🎯 목표
건강 관련 뉴스와 전문가 칼럼을 통한 커뮤니티 활성화

### 📝 구현 내용

#### 3.1 타입 확장
**파일**: `src/types/navigation.ts`

```typescript
// 탭 스크린에 community 추가
export type TabScreen =
  'home' | 'medication' | 'vaccination' | 'hospital' | 'health' | 'community';

// 커뮤니티 게시물 타입
export interface CommunityPost {
  id: string;
  type: 'news' | 'column';        // 뉴스 또는 칼럼
  title: string;                   // 제목
  author: string;                  // 작성자
  date: string;                    // 작성일
  thumbnail?: string;              // 썸네일 (선택)
  excerpt: string;                 // 요약
  content: string;                 // 본문
  category: string;                // 카테고리 (예방접종, 육아정보 등)
  likes: number;                   // 좋아요 수
  comments: number;                // 댓글 수
}
```

---

#### 3.2 커뮤니티 화면 구현
**파일**: `src/screens/tabs/CommunityScreen.tsx`

**주요 기능**:

##### 1) 카테고리 필터
```typescript
const [selectedCategory, setSelectedCategory] =
  useState<'all' | 'news' | 'column'>('all');

const filteredPosts = selectedCategory === 'all'
  ? MOCK_POSTS
  : MOCK_POSTS.filter(post => post.type === selectedCategory);
```

**UI 구조**:
```
┌─────────────────────────────────┐
│ 커뮤니티                         │
│ 건강 뉴스와 전문가 칼럼          │
├─────────────────────────────────┤
│ [전체] [뉴스] [칼럼]             │  ← 필터 버튼
└─────────────────────────────────┘
```

##### 2) 게시물 카드
```typescript
<Pressable key={post.id} style={styles.postCard}>
  {/* 헤더: 타입 배지 + 카테고리 */}
  <View style={styles.postHeader}>
    <View style={[styles.typeBadge,
      post.type === 'news' ? styles.typeBadgeNews : styles.typeBadgeColumn]}>
      <Text>{post.type === 'news' ? '뉴스' : '칼럼'}</Text>
    </View>
    <Text>{post.category}</Text>
  </View>

  {/* 제목 + 요약 */}
  <Text style={styles.postTitle}>{post.title}</Text>
  <Text style={styles.postExcerpt} numberOfLines={2}>
    {post.excerpt}
  </Text>

  {/* 푸터: 작성자 정보 + 통계 */}
  <View style={styles.postFooter}>
    <View style={styles.authorInfo}>
      <Text>{post.author}</Text>
      <Text>{post.date}</Text>
    </View>
    <View style={styles.postStats}>
      <Text>♥ {post.likes}</Text>
      <Text>💬 {post.comments}</Text>
    </View>
  </View>
</Pressable>
```

**카드 레이아웃**:
```
┌─────────────────────────────────┐
│ [뉴스] 예방접종                  │  ← 배지 + 카테고리
│                                  │
│ 2025년 영유아 예방접종 일정...   │  ← 제목
│ 2025년부터 영유아 예방접종...    │  ← 요약 (2줄)
│                                  │
│ 보건복지부                       │  ← 작성자
│ 2025년 10월 10일                 │  ← 날짜
│                        ♥245 💬32 │  ← 통계
└─────────────────────────────────┘
```

##### 3) 더미 데이터
```typescript
const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    type: 'news',
    title: '2025년 영유아 예방접종 일정 변경 안내',
    author: '보건복지부',
    date: '2025년 10월 10일',
    category: '예방접종',
    likes: 245,
    comments: 32,
    // ...
  },
  {
    id: '2',
    type: 'column',
    title: '우리 아이 건강한 성장을 위한 영양 관리 팁',
    author: '김소아 소아과 전문의',
    date: '2025년 10월 9일',
    category: '육아정보',
    likes: 512,
    comments: 87,
    // ...
  },
  // ... 총 4개의 샘플 게시물
];
```

**데이터 특징**:
- 실제 서비스를 시뮬레이션할 수 있는 현실적인 내용
- 예방접종, 육아정보 등 다양한 카테고리
- 뉴스와 칼럼의 차이를 명확히 구분
- 좋아요/댓글 수로 인기도 표현

---

#### 3.3 스타일링 디테일

**색상 구분**:
```typescript
// 뉴스 배지 - 코랄 핑크
typeBadgeNews: {
  backgroundColor: colors.accent.light,  // #FFB5A8
}

// 칼럼 배지 - 민트 그린
typeBadgeColumn: {
  backgroundColor: colors.primary.light,  // #8FD9CD
}
```

**필터 버튼 상태**:
```typescript
// 비활성
filterButton: {
  backgroundColor: colors.background.secondary,
  borderColor: colors.border.light,
}

// 활성
filterButtonActive: {
  backgroundColor: colors.primary.main,  // 민트 그린
  borderColor: colors.primary.main,
}
```

---

#### 3.4 TabNavigator 업데이트
```typescript
const TABS: TabItem[] = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'medication', label: '복약', icon: 'medical' },
  { id: 'vaccination', label: '접종', icon: 'shield-checkmark' },
  { id: 'hospital', label: '병원', icon: 'business' },
  { id: 'health', label: '건강', icon: 'heart' },
  { id: 'community', label: '커뮤니티', icon: 'people' },  // 추가
];
```

**아이콘 선택**:
- `people`: 커뮤니티의 '사람들'을 상징
- outline/filled 변형 지원

---

#### 3.5 App.tsx 통합
```typescript
// Import 추가
import { CommunityScreen } from './src/screens/tabs/CommunityScreen';

// renderTabScreen에 케이스 추가
const renderTabScreen = () => {
  switch (activeTab) {
    // ... 기존 케이스들
    case 'community':
      return <CommunityScreen />;
    // ...
  }
};
```

---

## 4. 주요 변경 파일

### 📁 파일 구조
```
frontend/MamyApp/
├── src/
│   ├── types/
│   │   └── navigation.ts                  ✏️ 수정: community 타입 추가
│   ├── components/
│   │   └── TabNavigator.tsx               ✏️ 수정: 벡터 아이콘 적용
│   ├── screens/
│   │   ├── DashboardScreen.tsx            ✏️ 수정: 접종 카드 추가
│   │   └── tabs/
│   │       ├── MedicationScreen.tsx       ✨ 신규
│   │       ├── VaccinationScreen.tsx      ✨ 신규
│   │       ├── HospitalScreen.tsx         ✨ 신규
│   │       ├── HealthScreen.tsx           ✨ 신규
│   │       └── CommunityScreen.tsx        ✨ 신규
│   └── ...
├── ios/
│   └── MamyApp/
│       └── Info.plist                     ✏️ 수정: 아이콘 폰트 등록
├── App.tsx                                ✏️ 수정: 탭 네비게이션 통합
└── package.json                           ✏️ 수정: vector-icons 추가
```

### 📝 변경 요약

#### 신규 생성 (5개)
1. `src/screens/tabs/MedicationScreen.tsx` - 복약관리 화면
2. `src/screens/tabs/VaccinationScreen.tsx` - 예방접종 화면
3. `src/screens/tabs/HospitalScreen.tsx` - 병원 일정 화면
4. `src/screens/tabs/HealthScreen.tsx` - 건강 기록 화면
5. `src/screens/tabs/CommunityScreen.tsx` - 커뮤니티 화면

#### 수정 (4개)
1. `src/types/navigation.ts` - 타입 정의 확장
2. `src/components/TabNavigator.tsx` - 벡터 아이콘 적용
3. `src/screens/DashboardScreen.tsx` - 접종 카드 추가
4. `App.tsx` - 전체 네비게이션 통합

#### 설정 (2개)
1. `ios/MamyApp/Info.plist` - iOS 아이콘 폰트 등록
2. `package.json` - react-native-vector-icons 추가

---

## 📊 전체 네비게이션 흐름도

```
[스플래시 화면]
      ↓
[로그인 화면]
      ↓
[사용자 모드 선택]
   (보호자/가족/전문가)
      ↓
[대시보드 + 탭 네비게이션]
      ↓
┌─────┬─────┬─────┬─────┬─────┬─────┐
│ 홈  │복약 │접종 │병원 │건강 │커뮤 │
│ 🏠  │ 💊  │ 💉  │ 🏥  │ ❤️  │ 👥  │
└─────┴─────┴─────┴─────┴─────┴─────┘
  ↓      ↓     ↓     ↓     ↓     ↓
[대시보드][복약][접종][병원][건강][커뮤니티]
```

---

## 🎨 디자인 시스템

### 색상 팔레트
```typescript
colors = {
  primary: {
    main: '#6FCCBD',      // 민트 그린 (메인)
    light: '#8FD9CD',     // 연한 민트
    dark: '#4DB3A3',      // 진한 민트
  },
  accent: {
    main: '#FF8B7B',      // 코랄 핑크 (포인트)
    light: '#FFB5A8',     // 연한 코랄
  },
  // ...
}
```

### 아이콘 규칙
- **크기**: 24px (통일)
- **활성**: filled 스타일 + 민트 그린 (#6FCCBD)
- **비활성**: outline 스타일 + 회색 (#8E8E93)

---

## 🚀 다음 단계 개발 계획

### 단기 (이번 주)
- [ ] 실제 API 연동 준비
- [ ] 각 화면의 상세 기능 구현
- [ ] 데이터 저장소 설계 (AsyncStorage or Backend)

### 중기 (다음 주)
- [ ] 커뮤니티 게시물 상세 화면
- [ ] 댓글 및 좋아요 기능
- [ ] 알림 기능 구현

### 장기
- [ ] 백엔드 API 개발
- [ ] 사용자 인증 및 권한 관리
- [ ] 푸시 알림 서비스

---

## 💡 팀원 공유 사항

### 코드 리뷰 포인트
1. **컴포넌트 구조**: 각 화면이 독립적으로 작동
2. **타입 안정성**: TypeScript로 모든 데이터 타입 정의
3. **재사용성**: TabNavigator는 설정만 변경하면 다른 곳에서도 사용 가능
4. **확장성**: 새로운 탭 추가 시 3단계만 수행
   - 타입에 추가
   - 화면 컴포넌트 생성
   - App.tsx에 등록

### 테스트 체크리스트
- [ ] 모든 탭이 정상적으로 전환되는지 확인
- [ ] 아이콘이 활성/비활성 상태에 따라 올바르게 표시되는지 확인
- [ ] 보호자 모드에서만 접종 카드가 보이는지 확인
- [ ] 커뮤니티 필터가 정상 작동하는지 확인

### 주의사항
- vector-icons 사용 시 반드시 `pod install` 필요
- 새로운 아이콘 추가 시 Ionicons 문서 참고: https://ionic.io/ionicons
- 상태 관리가 복잡해지면 Context API 또는 Redux 도입 고려

---

**작성자**: 개발팀
**마지막 업데이트**: 2025년 10월 11일
**버전**: 1.0.0
