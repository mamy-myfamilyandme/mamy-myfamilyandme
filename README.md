# 🍼 Mamy - 우리가족 예방접종 관리 앱


## 📋 프로젝트 개요

**핵심 기능:**
- 📷 접종증명서 OCR 자동 입력
- 📅 개인 맞춤 접종 일정 관리
- 🔔 접종 시기 알림
- 📊 접종 현황 한눈에 보기

**개발 기간:** 8주 MVP  
**팀 구성:** 백엔드 1명, 프론트엔드 1명, AI 1명, 풀스택 1명

---

## 🗂️ 프로젝트 구조

```
mamy-myfamilyandme/
├── backend/          # Django REST API
├── frontend/         # React Native App
└── docs/            # 프로젝트 문서
```

---

## ⚡ 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/mamy-myfamilyandme/mamy-myfamilyandme.git
cd mamy-myfamilyandme
```

### 2. 백엔드 실행 (Django)
```bash
cd backend
uv sync
uv run python manage.py runserver
```
🌐 **접속:** http://localhost:8000

### 3. 프론트엔드 실행 (React Native)
```bash
cd frontend/MamyApp
npm install
npx react-native run-android    # Android
# npx react-native run-ios      # iOS (macOS only)
```

### 4. 브랜치 생성하여 작업
```bash
git checkout -b feature/your-name-initial-work
git push -u origin feature/your-name-initial-work
```

---

## 🛠️ 기술 스택

### Backend
- **Django 4.2** + Django REST Framework
- **PostgreSQL** (개발: SQLite)
- **Redis** (알림, 캐시)
- **uv** (패키지 관리)

### Frontend  
- **React Native** + TypeScript
- **Redux Toolkit** (상태 관리)
- **React Navigation** (네비게이션)

### AI/ML
- 미정

---

## 👥 팀 역할

---

## 📂 주요 폴더 구조

### Backend
```
backend/
├── config/           # Django 설정
├── accounts/         # 사용자 관리
├── children/         # 아이 정보 관리
├── vaccinations/     # 예방접종 관리
├── requirements.txt  # 의존성 (uv로 관리)
└── .env             # 환경변수
```

### Frontend
```
frontend/MamyApp/
├── src/
│   ├── screens/      # 화면 컴포넌트
│   ├── components/   # 재사용 컴포넌트
│   ├── services/     # API 통신
│   └── types/        # TypeScript 타입
└── package.json
```

---

## 🔧 환경 설정

### 필수 도구 설치
- **Python 3.11+**
- **Node.js 18+**
- **uv** (Python 패키지 관리)
- **Android Studio** (Android 개발)
- **Xcode** (iOS 개발, macOS only)

### 환경변수 설정

```bash
# backend/.env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100
```

---

## 🚀 개발 워크플로우

### 1. 새 기능 개발
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# 개발 작업...
git add .
git commit -m "feat: 기능 설명"
git push origin feature/your-feature-name
# GitHub에서 PR 생성
```

### 2. 커밋 메시지 규칙
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
```

### 3. 코드 품질 관리
```bash
# 백엔드 (backend/)
uv run ruff check .      # 린팅
uv run ruff format .     # 포맷팅
uv run pytest           # 테스트

# 프론트엔드 (frontend/MamyApp/)
npm run lint            # ESLint
npm run format          # Prettier
npm test               # Jest 테스트
```

---

## 📋 개발 체크리스트

### 첫 실행 시
- [ ] 저장소 클론 완료
- [ ] 백엔드 서버 실행 성공 (http://localhost:8000)
- [ ] 프론트엔드 앱 실행 성공
- [ ] 개발 브랜치 생성 및 푸시

### 기능 개발 시
- [ ] 기능별 브랜치 생성
- [ ] 코드 린팅/포맷팅 통과
- [ ] 기본 테스트 작성
- [ ] PR 생성 전 충돌 확인

---

## 🐛 문제 해결

### 자주 발생하는 문제

**1. 백엔드 서버 실행 안됨**
```bash
cd backend
uv sync --reinstall
uv run python manage.py migrate
```

**2. React Native 빌드 실패**
```bash
cd frontend/MamyApp
npm cache clean --force
npm install
npx react-native start --reset-cache
```

**3. Android 에뮬레이터 연결 안됨**
```bash
adb devices  # 디바이스 확인
adb reverse tcp:8000 tcp:8000  # 포트 포워딩
```
---

## 🎯 현재 상태

- [x] 프로젝트 초기 설정 완료
- [x] 백엔드 초기 설정 완료
- [x] 프론트엔드 초기 설정 완료
- [ ] 백엔드 기본 구조 완성
- [ ] 프론트엔드 기본 구조 완성