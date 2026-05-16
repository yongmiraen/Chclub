# 크로소 — 크리스천 소모임

> 성경공부·기도·찬양 같은 신앙 모임부터 운동·독서·맛집 같은 일상 취미까지, 크리스천이 함께할 소모임을 만들고 가입하는 웹앱.

Next.js (App Router) + Supabase 기반 사이드 프로젝트입니다. 로그인 없이 누구나
모임을 만들고 가입할 수 있고, 작성자만 PIN 4자리로 수정·삭제할 수 있습니다.

## 1. Supabase 프로젝트 만들기

1. <https://supabase.com> 에 가입 → **New project** 생성 (무료 플랜으로 충분)
2. 프로젝트가 준비되면 좌측 **SQL Editor** 열기
3. 이 저장소의 [`sql/schema.sql`](./sql/schema.sql) 내용을 그대로 붙여넣고 **Run**
4. 좌측 **Project settings → API** 에서 두 값 복사
   - `Project URL`
   - `anon` (public) key

## 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 두 값을 채워 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

(`.env.local.example` 참고)

## 3. 개발 서버 실행

```bash
npm install      # 이미 했다면 생략
npm run dev
```

<http://localhost:3000> 에서 확인.

## 기능

- 모임 만들기 / 목록 / 검색 / 카테고리 필터
- 모임 상세 + 참여 신청 (닉네임 + 선택 연락처·한마디)
- 참여 표시는 브라우저 localStorage 에 저장 (재가입 방지 UI용)
- 방장 PIN(4자리) 검증으로 모임 수정 / 삭제
- 카테고리 — **신앙**: 성경공부, 기도, 찬양, 큐티, 봉사 / **취미**: 운동, 독서, 음식, 음악, 영화, 여행, 보드게임, 기타

## 폴더 구조

```
src/
  app/
    page.tsx                    # 홈 (목록 + 검색/필터)
    groups/new/page.tsx         # 만들기
    groups/[id]/page.tsx        # 상세 + 참여
    groups/[id]/edit/page.tsx   # 수정 / 삭제
  components/
    Header.tsx
    GroupCard.tsx
    GroupForm.tsx
    JoinPanel.tsx
    DeleteGroupButton.tsx
    CategoryBadge.tsx
  lib/
    supabase.ts                 # Supabase 클라이언트
    actions.ts                  # 서버 액션 (CRUD, join)
    categories.ts               # 카테고리 정의
    pin.ts                      # PIN 해시·검증
    types.ts
sql/
  schema.sql                    # Supabase 스키마
```

## 보안 노트 (학습용)

- 로그인이 없으므로 Supabase RLS 는 `anon` 전체 허용으로 열려 있습니다.
- 수정·삭제는 PIN 4자리(서버에서 salt + SHA-256 으로 해시 검증)로만 보호됩니다.
- 공개 서비스로 띄울 계획이라면 다음이 필요합니다:
  - 진짜 인증(Supabase Auth, 카카오/구글 OAuth) 도입
  - RLS 정책을 `auth.uid()` 기준으로 다시 작성
  - 신고/차단, 개인정보처리방침, rate-limit 등 운영 요소 추가

## 다음에 붙이면 좋은 것들

- 기도 댓글 ("함께 기도합니다" 카운트) — Prayer Wall 강화
- 모임 일정·캘린더, 출석 체크
- 댓글/공지 게시판
- 카카오 로그인 + 알림 (실서비스 단계)
