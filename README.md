# 🍼 Mamy - 우리가족 예방접종 관리 앱

## 📋 프로젝트 개요

**핵심 기능:**
- 📷 접종증명서 OCR 자동 입력
- 📅 개인 맞춤 접종 일정 관리
- 🔔 접종 시기 알림
- 📊 접종 현황 한눈에 보기

**팀 구성:** 백엔드 1명, 프론트엔드 1명, AI 1명, 풀스택 1명

---

## 🗂️ 프로젝트 구조
```
mamy-myfamilyandme/
├── backend/          # Django REST API
├── frontend/
│   └── MamyApp/     # React Native Expo App
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

### 3. 프론트엔드 실행 (React Native + Expo)
```bash
cd frontend/MamyApp
npm install
npx expo start
```
📱 **실행:** Expo Go 앱에서 QR 코드 스캔

### 4. Pre-commit 설정 (처음 1번만)
```bash
cd backend
uv run pre-commit install
```

---

## 🛠️ 기술 스택

### Backend
- **Django 4.2** + Django REST Framework
- **PostgreSQL** (개발: SQLite)
- **Redis** (알림, 캐시)
- **uv** (패키지 관리)
- **Ruff** (린팅/포맷팅)

### Frontend  
- **React Native (Expo)** + TypeScript
- **상태 관리** TBD (Redux Toolkit / Zustand)
- **React Navigation** (예정)
- **ESLint + Prettier** (코드 품질)

### AI/ML
- 미정

---

## 📂 주요 폴더 구조

### Backend
```
backend/
├── config/           # Django 설정
├── accounts/         # 사용자 관리
├── children/         # 아이 정보 관리
├── vaccinations/     # 예방접종 관리
├── pyproject.toml   # uv 의존성 관리
└── .env             # 환경변수
```

### Frontend
```
frontend/MamyApp/
├── src/
│   ├── components/   # 재사용 컴포넌트
│   │   ├── common/   # Button, Input 등
│   │   └── layout/   # Header, Navigation Bar
│   ├── screens/      # 화면 컴포넌트
│   ├── navigation/   # 화면 전환 (예정)
│   ├── services/     # API, OCR, 헬스킷
│   │   ├── api/      # 백엔드 API 통신
│   │   ├── ocr/      # OCR 처리
│   │   └── health/   # iOS/Android 헬스킷
│   ├── hooks/        # 커스텀 React Hook
│   ├── types/        # TypeScript 타입
│   ├── utils/        # 유틸리티 함수
│   └── constants/    # 상수 (색상, API URL)
├── assets/           # 이미지, 폰트
├── App.tsx           # 앱 진입점
└── package.json
```

---

## 🔧 환경 설정

### 필수 도구 설치
- **Python 3.11+**
- **Node.js 18+**
- **npm 9+**
- **uv** (Python 패키지 관리)
- **Expo Go 앱** (iOS/Android 모바일 기기에 설치)

### 선택 도구 (네이티브 빌드 시)
- **Android Studio** (Android 네이티브 개발)
- **Xcode** (iOS 네이티브 개발, macOS only)

### 환경변수 설정
```bash
# backend/.env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100
```

**참고:** Expo 사용 시 Android Studio/Xcode는 필수가 아닙니다. 
실제 기기에서 Expo Go 앱으로 테스트 가능합니다.

---

## 🚀 개발 워크플로우

### 📝 기본 흐름
```
1. 브랜치 생성 → 2. 코드 작성 → 3. 자동 검사 → 4. 커밋 → 5. PR 생성
```

### 1️⃣ 새 기능 개발 시작

```bash
# 최신 코드 받기
git checkout master
git pull origin master

# 새 브랜치 생성
git checkout -b feature/기능명
# 예시: feature/vaccination-ocr, feature/child-profile
```

**브랜치 네이밍 규칙:**
- `feature/` - 새 기능
- `fix/` - 버그 수정
- `docs/` - 문서 수정
- `refactor/` - 코드 리팩토링

---

### 2️⃣ Backend 개발 후 커밋

```bash
cd backend

# 1. 코드 작성 후 린팅 & 포맷팅 (선택)
uv run ruff check .        # 문제 확인
uv run ruff check . --fix  # 자동 수정
uv run ruff format .       # 포맷팅

# 2. 테스트 실행 (선택)
uv run pytest

# 3. Git에 추가
git add .

# 4. 커밋 (자동으로 pre-commit 실행됨!)
git commit -m "feat: 예방접종 OCR API 구현"
```

**✨ 커밋 시 자동 실행:**
- 🐍 Ruff 린팅/포맷팅 (자동 수정)
- 📝 파일 끝 공백/줄바꿈 체크
- ⚠️ Merge conflict 체크

**❌ 만약 pre-commit 실패하면:**
```bash
# 자동 수정된 파일 다시 add
git add .

# 다시 커밋
git commit -m "feat: 예방접종 OCR API 구현"
```

---
### 3️⃣ Frontend 개발 후 커밋
```bash
cd frontend/MamyApp

# 1. 코드 작성 후 검사 (선택)
npm run lint           # ESLint 검사
npm run format         # Prettier 포맷팅
npm run type-check     # TypeScript 타입 검사

# 2. Git에 추가 (루트 디렉토리에서)
cd ../..
git add frontend/MamyApp

# 3. 커밋 (자동으로 pre-commit 실행됨!)
git commit -m "feat: 접종 일정 화면 구임"
```

**✨ 커밋 시 자동 실행:**
- ⚛️ ESLint (자동 수정)
- 🎨 Prettier (자동 포맷팅)
- 📝 파일 끝 공백/줄바꿈 체크
- 🔍 TypeScript 타입 검사

**💡 팁:**
- `npm run format` 먼저 실행하면 대부분의 린트 에러 해결
- 타입 에러는 수동으로 수정 필요

---

### 4️⃣ GitHub에 푸시

```bash
# 프로젝트 루트에서
git push origin feature/기능명

# 처음 푸시하는 브랜치라면
git push -u origin feature/기능명
```

---

### 5️⃣ Pull Request 생성

1. GitHub 저장소 페이지 접속
2. **"Compare & pull request"** 버튼 클릭
3. PR 제목 작성 (커밋 메시지 규칙 동일)
4. 변경사항 설명 작성
5. **"Create pull request"** 클릭

**PR 템플릿:**
```markdown
## 📝 변경사항
- 예방접종 OCR API 구현
- Child 모델에 birth_certificate_image 필드 추가

## ✅ 체크리스트
- [x] Ruff 검사 통과
- [x] 테스트 작성
- [x] 문서 업데이트

## 📸 스크린샷 (선택)
```

---

### 6️⃣ 코드 리뷰 후 Merge

1. 팀원 리뷰 대기
2. 수정 요청사항 반영
3. 승인 후 **Squash and merge** 또는 **Merge pull request**
4. 브랜치 삭제

```bash
# 로컬에서 정리
git checkout master
git pull origin master
git branch -d feature/기능명  # 로컬 브랜치 삭제
```

---
## 💡 커밋 메시지 규칙

### 기본 형식
```
[KAN-XX] 타입: 제목 (50자 이내)

본문 (선택, 72자마다 줄바꿈)
```

또는
```
타입: [KAN-XX] 제목 (50자 이내)
```

**팀 규칙:** Jira 티켓 번호 포함 필수

### 타입 종류
| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새 기능 | `feat: [KAN-15] 접종 알림 기능 추가` |
| `fix` | 버그 수정 | `fix: [KAN-20] 날짜 계산 오류 수정` |
| `docs` | 문서 수정 | `docs: [KAN-15] API 문서 업데이트` |
| `style` | 코드 포맷팅 | `style: [KAN-18] import 순서 정리` |
| `refactor` | 리팩토링 | `refactor: [KAN-22] API 호출 로직 개선` |
| `test` | 테스트 | `test: [KAN-19] 접종 서비스 테스트 추가` |
| `chore` | 빌드/설정 | `chore: [KAN-15] 프로젝트 초기 설정` |

### 예시

**좋은 예:**
```bash
git commit -m "feat: [KAN-15] 예방접종 OCR 기능 구현"
git commit -m "fix: [KAN-20] 아이 생년월일 유효성 검사 오류 수정"
git commit -m "docs: [KAN-15] README에 설치 가이드 추가"
git commit -m "chore: [KAN-15] React Native Expo 프로젝트 초기 설정"

# 티켓 번호를 앞에 쓰는 방식도 가능
git commit -m "[KAN-15] chore: 프로젝트 초기 설정"
```

**나쁜 예:**
```bash
git commit -m "수정"                    # ❌ 티켓 번호 없음
git commit -m "작업중"                  # ❌ 의미 불명확
git commit -m "feat: OCR 추가"          # ❌ 티켓 번호 없음
git commit -m "asdfasdf"                # ❌ 무의미
```

### 멀티라인 커밋 메시지
```bash
git commit -m "feat: [KAN-23] 복약 알림 기능 구현

- 푸시 알림 권한 요청 추가
- 알림 스케줄링 로직 구현
- 사용자 설정 화면 연동"
```

---

## 🔍 Pre-commit 상세 가이드

### 자동 검사 항목

**Backend (Python):**
```
✅ Ruff 린팅 - 코드 스타일 체크
✅ Ruff 포맷팅 - Black 스타일 자동 포맷
✅ Python 문법 체크
```

**Frontend (TypeScript):**
```
✅ ESLint - 코드 품질 체크
✅ 자동 수정 가능한 항목 수정
```

**공통:**
```
✅ 파일 끝 공백 제거
✅ 파일 끝 줄바꿈 추가
✅ YAML/JSON 문법 체크
✅ Merge conflict 마커 체크
✅ 대용량 파일 업로드 방지 (1MB 이상)
```

### 수동 실행

```bash
# 전체 파일 검사
cd backend
uv run pre-commit run --all-files

# 특정 파일만 검사
uv run pre-commit run --files accounts/models.py

# 특정 훅만 실행
uv run pre-commit run ruff --all-files
```

### Pre-commit 건너뛰기 (비상시만!)

```bash
# 급한 경우에만 사용 (비추천)
git commit -m "긴급 수정" --no-verify
```

⚠️ **주의:** 가급적 사용하지 마세요. CI에서 실패할 수 있습니다.

---

## 🧪 테스트 실행

### Backend 테스트
```bash
cd backend

# 전체 테스트
uv run pytest

# 특정 앱만 테스트
uv run pytest accounts/

# 커버리지 확인
uv run pytest --cov=.

# 커버리지 HTML 리포트
uv run pytest --cov=. --cov-report=html
```

### Frontend 테스트
```bash
cd frontend/MamyApp

# 전체 테스트
npm test

# Watch 모드
npm test -- --watch

# 커버리지
npm test -- --coverage
```

---

## 🐛 문제 해결

### Pre-commit 관련

**문제: pre-commit이 너무 느려요**
```bash
# 캐시 정리
cd backend
uv run pre-commit clean
uv run pre-commit install --install-hooks
```

**문제: pre-commit이 실행 안돼요**
```bash
# 재설치
cd backend
uv run pre-commit uninstall
uv run pre-commit install
```

**문제: Django Check 실패**
```bash
# 모델 마이그레이션
cd backend
uv run python manage.py makemigrations
uv run python manage.py migrate
```

### Git 관련

**문제: 브랜치 충돌 발생**
```bash
# master 브랜치 최신화
git checkout master
git pull origin master

# 작업 브랜치로 돌아가서 merge
git checkout feature/기능명
git merge master

# 충돌 해결 후
git add .
git commit -m "chore: merge master"
```

**문제: 잘못된 커밋을 푸시했어요**
```bash
# 마지막 커밋 취소 (로컬만)
git reset --soft HEAD~1

# 이미 푸시했다면 (주의!)
git revert HEAD
git push origin feature/기능명
```

### Backend 관련

**문제: uv sync 실패**
```bash
cd backend
uv cache clean
uv sync --reinstall
```

**문제: 서버 실행 안됨**
```bash
cd backend
uv run python manage.py migrate
uv run python manage.py runserver 0.0.0.0:8000
```

### Frontend 관련

**문제: npm install 실패**
```bash
cd frontend/MamyApp
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**문제: React Native 빌드 실패**
```bash
cd frontend/MamyApp
npx react-native start --reset-cache

# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 📋 개발 체크리스트

### 🎯 첫 설정 (처음 1번만)
- [ ] 저장소 클론 완료
- [ ] Backend 의존성 설치 (`cd backend && uv sync`)
- [ ] Frontend 의존성 설치 (`cd frontend/MamyApp && npm install`)
- [ ] Pre-commit 설치 (`cd backend && uv run pre-commit install`)
- [ ] 백엔드 서버 실행 확인 (http://localhost:8000)
- [ ] 프론트엔드 앱 실행 확인

### 🚀 기능 개발 시
- [ ] 새 브랜치 생성 (`git checkout -b feature/기능명`)
- [ ] 코드 작성
- [ ] 린팅/포맷팅 확인 (자동 또는 수동)
- [ ] 테스트 작성 및 실행
- [ ] 커밋 (pre-commit 자동 실행)
- [ ] GitHub 푸시
- [ ] PR 생성 및 리뷰 요청

### ✅ PR 생성 전
- [ ] `git pull origin master`으로 최신 코드 반영
- [ ] 충돌 해결 완료
- [ ] 모든 테스트 통과
- [ ] Pre-commit 검사 통과
- [ ] 커밋 메시지 규칙 준수

---

## 🎯 현재 상태

- [x] 프로젝트 초기 설정 완료
- [x] 백엔드 초기 설정 완료
- [x] 프론트엔드 초기 설정 완료
- [x] Pre-commit 설정 완료
- [ ] 백엔드 기본 구조 완성
- [ ] 프론트엔드 기본 구조 완성

---

## 📞 도움이 필요할 때

**막히는 부분이 있다면:**
1. 에러 메시지 전체 복사
2. 시도한 해결 방법 정리
3. 팀 채널에 공유

**자주 묻는 질문:**
- Pre-commit 관련: `.pre-commit-config.yaml` 참고
- Backend API: `backend/README.md` 참고
- Frontend 컴포넌트: `frontend/MamyApp/README.md` 참고