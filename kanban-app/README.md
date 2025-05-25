# 칸반 보드 애플리케이션

![칸반 보드 애플리케이션](./image.jpg)

## 프로젝트 개요

이 프로젝트는 사용자가 작업을 시각적으로 관리하고 팀원들과 효율적으로 협업할 수 있는 현대적인 칸반 보드 웹 애플리케이션입니다. Next.js와 TypeScript를 기반으로 구축되었으며, Supabase를 통한 백엔드 기능을 통합하여 사용자 인증과 데이터베이스 관리를 제공합니다.

### 주요 특징

- **직관적인 UI/UX**: Tailwind CSS를 사용한 깨끗하고 반응형 인터페이스
- **드래그 앤 드롭 기능**: React Beautiful DnD를 활용한 직관적인 카드 및 칼럼 이동
- **실시간 데이터 동기화**: Supabase를 통한 데이터 저장 및 동기화
- **반응형 디자인**: 다양한 화면 크기에 대응하는 모바일 프렌들리 디자인
- **사용자 인증**: 회원가입, 로그인, 소셜 로그인 지원

### 사용 시나리오

1. **사용자 등록 및 로그인**: 회원가입 후 개인 계정으로 로그인
2. **보드 생성**: 새로운 프로젝트나 작업 관리를 위한 보드 생성
3. **칼럼 관리**: 작업 상태를 나타내는 칼럼 추가, 수정, 삭제
4. **카드 관리**: 각 칼럼에 작업 카드 추가, 수정, 삭제 및 이동
5. **작업 진행**: 드래그 앤 드롭으로 카드를 이동하며 작업 진행 상태 관리

## 최근 개발 내용 (2025-05-25)

### 기능 개선

- **칼럼 삭제 기능**: 각 칼럼에 삭제 버튼을 추가하여 칼럼과 해당 칼럼의 모든 카드를 함께 삭제할 수 있는 기능 구현
- **확인 대화상자**: 칼럼 삭제 시 실수로 인한 데이터 손실을 방지하기 위한 확인 대화상자 추가
- **헤더 레이아웃 개선**: "칸반 보드" 버튼을 왼쪽 정렬로 변경하고 중복된 "내 보드" 버튼 숨김 처리
- **카드 업데이트 로직 개선**: 카드 내용 업데이트 시 상태 관리 방식 개선

### 기술적 개선

- **컴포넌트 정의 방식 변경**: React 18.3 이상 버전에서 발생하는 JSX 반환 타입 문제 해결을 위해 `React.FC` 대신 일반 함수 형태로 컴포넌트 정의 방식 변경
- **타입 오류 해결**: TypeScript 타입 관련 오류 해결 및 타입 안정성 개선
- **코드 가독성 향상**: 주석 추가 및 코드 구조 개선

## 주요 기능

- 사용자 인증 (회원가입, 로그인)
- 보드 생성 및 관리
- 드래그 앤 드롭으로 카드 이동
- 카드에 제목, 설명, 마감일, 라벨 등 정보 추가
- 칼럼 추가 및 관리

## 기술 스택

- **프론트엔드**: Next.js, TypeScript, Tailwind CSS, React Beautiful DnD
- **백엔드**: Supabase (인증, 데이터베이스)

## 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 프로젝트 구조

### 폴더 구조

```
kanban-app/
├── components/         # 재사용 가능한 컴포넌트
│   ├── DroppableWrapper.tsx  # react-beautiful-dnd 래퍼 컴포넌트
│   ├── Header.tsx      # 사이트 헤더 컴포넌트
│   ├── KanbanBoard.tsx  # 칸반 보드 메인 컴포넌트
│   ├── KanbanCard.tsx   # 카드 컴포넌트
│   ├── KanbanColumn.tsx # 칼럼 컴포넌트
│   └── Layout.tsx       # 전체 레이아웃 컴포넌트
├── lib/               # 유틸리티 및 라이브러리
│   └── supabase.ts     # Supabase 클라이언트 구성
├── pages/             # Next.js 페이지
│   ├── _app.tsx        # 애플리케이션 엔트리포인트
│   ├── auth/           # 인증 관련 페이지
│   ├── boards/         # 보드 관련 페이지
│   └── index.tsx       # 홈페이지
├── public/            # 정적 파일
├── styles/            # CSS 스타일
├── types/             # 타입스크립트 타입 정의
└── utils/             # 유틸리티 함수
```

### 아키텍처

이 프로젝트는 다음과 같은 아키텍처를 기반으로 하고 있습니다:

1. **프론트엔드**: 사용자 인터페이스와 상태 관리
   - Next.js를 통한 서버사이드 렌더링 및 클라이언트사이드 네비게이션
   - React 컴포넌트를 통한 UI 구성
   - React Beautiful DnD를 통한 드래그 앤 드롭 기능
   - Tailwind CSS를 통한 스타일링

2. **백엔드**: 데이터 저장 및 인증
   - Supabase를 통한 사용자 인증 및 권한 관리
   - PostgreSQL 데이터베이스를 통한 데이터 저장
   - RESTful API를 통한 데이터 접근

## 데이터베이스 구조

### 테이블 구조

- **users**: 사용자 정보
  - id, email, password, name, avatar_url, created_at

- **boards**: 칸반 보드
  - id, title, description, owner_id, created_at, updated_at

- **columns**: 보드 내 칼럼 (To Do, In Progress, Done 등)
  - id, title, board_id, position, created_at

- **cards**: 칼럼 내 카드 (작업 항목)
  - id, title, description, column_id, position, label_color, due_date, created_at, updated_at

## 개발 로드맵

### 예정된 기능

- [ ] 카드 필터링 및 검색 기능
- [ ] 드래그 앤 드롭으로 칼럼 순서 변경 기능
- [ ] 카드에 첨부파일 추가 기능
- [ ] 사용자 지정 라벨 관리
- [ ] 알림 및 리마인더 기능
- [ ] 팀 구성원 초대 및 권한 관리
- [ ] 다크 모드 / 라이트 모드 테마 지원

### 버그 및 개선 사항

- [ ] 모바일 화면에서 드래그 앤 드롭 개선
- [ ] 데이터 캡싱 방지를 위한 오프라인 모드 지원
- [ ] 성능 최적화 및 로딩 속도 개선

## 기여 방법

프로젝트에 기여하고 싶으시다면 다음 단계를 따라주세요:

1. 이 레포지토리를 포크하세요
2. 기능 개발을 위한 브랜치를 생성하세요 (`git checkout -b feature/your-feature-name`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: 기능 추가'`)
4. 브랜치를 푸시하세요 (`git push origin feature/your-feature-name`)
5. Pull Request를 제출하세요

### 커밋 메시지 규칙

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 규칙을 따릅니다:

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 변경
- `style:` 코드 포맷팅, 세미콜론 누락 등
- `refactor:` 코드 리팩토링
- `test:` 테스트 코드 추가 또는 수정
- `chore:` 빌드 프로세스 또는 도구 변경

## 라이선스

MIT
