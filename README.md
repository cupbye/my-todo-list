# Premium React Todo & Calendar App

세련된 디자인과 강력한 일정 관리 기능을 제공하는 리액트 기반 투두 리스트 애플리케이션입니다.

## 주요 기능 ✨

### 1. 일정 관리 (Calendar & Todo)
- **월별 달력**: 한눈에 들어오는 월간 뷰를 통해 일정을 관리할 수 있습니다. (일요일 시작)
- **날짜별 독립 목록**: 각 날짜를 클릭하여 해당 날짜의 할 일을 따로 기록하고 관리할 수 있습니다.
- **상태 표시 (Dot Indicators)**:
    - 🔵 **진행 중**: 할 일이 등록된 상태입니다.
    - ⚪ **완료**: 해당 날짜의 모든 할 일을 완료하면 점이 회색으로 변합니다.
    - 🔴 **바쁨**: 할 일이 5개를 초과하면 빨간색 점으로 강조됩니다.

### 2. 세련된 사용자 경험 (UX/UI)
- **프리미엄 디자인**: Glassmorphism 효과와 미려한 다크 모드 테마가 기본 적용되어 있습니다.
- **테마 전환**: 상단 토글 버튼을 통해 다크 모드와 라이트 모드를 자유롭게 전환할 수 있습니다.
- **완료 처리**: 할 일 텍스트를 클릭하면 취소선과 함께 완료 상태가 토글됩니다.
- **애니메이션**: 부드러운 Fade-in 및 리스트 전환 효과가 적용되어 있습니다.

## 기술 스택 🛠️
- **Core**: React 19 (SWC)
- **State Management**: React Hooks (useState, useEffect)
- **Date Utility**: date-fns
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid)
- **Build Tool**: Vite

## 시작하기 🚀

### 1. Firebase 설정 (중요 ⚠️)
데이터 영속성을 위해 Firebase 프로젝트 설정이 필요합니다.
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트를 생성합니다.
2. 'Web' 앱을 추가하고 제공되는 `firebaseConfig` 객체를 복사합니다.
3. 프로젝트 루트의 `src/firebase.js` 파일을 열고, 해당 객체 내용을 본인의 설정값으로 교체합니다.
4. Firestore Database를 활성화하고, 규칙(Rules) 탭에서 테스트 모드로 설정하거나 권한을 부여합니다.

### 2. 종속성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

접속 주소: [http://localhost:5173/](http://localhost:5173/)

## 배포 정보 🌐
- **데모 URL**: [https://test-chi-nine-88.vercel.app](https://test-chi-nine-88.vercel.app)
- **플랫폼**: Vercel

---
Created by Antigravity AI
