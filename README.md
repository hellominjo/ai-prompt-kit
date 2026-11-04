# AI 프롬프트 레시피북

> 필요한 순간, 바로 꺼내 쓰는 AI 프롬프트

옵션을 고르고 한 줄만 적으면 ChatGPT·Gemini 같은 AI에 바로 붙여넣을 수 있는 프롬프트를 만들어 주는 웹 서비스
기본 프롬프트는 AI 없이 즉시 생성되고, 원하면 Claude · ChatGPT · Gemini 중 하나로 프롬프트를 더 자세하게 다듬은 서비스

## 주요 기능

- **작업 카테고리 검색** — 이미지, 글쓰기, 업무, 학습, 일상, 콘텐츠
- **상황별 프롬프트 빌더** (`/prompts/...`)
  - `/prompts/image` — AI 이미지: 프로필 사진 / 블로그 썸네일 / 상품 홍보 이미지
  - `/prompts/writing` — AI 글쓰기: 블로그 포스팅 / 자기소개서 / 이메일
  - `/prompts/business` — AI 업무: 보고서 / 회의록 / 기획서
  - `/prompts/study` — AI 학습: 개념 요약 / 시험 대비 문제 / 외국어 회화
  - `/prompts/life` — AI 일상: 여행 계획 / 요리 추천 / 일정 계획
  - `/prompts/content` — AI 콘텐츠: 유튜브 대본 / 인스타그램 게시물 / 카드뉴스 기획
  - 옵션 선택 + 한 줄 요청, 원클릭 복사
- **AI로 다듬기** — Claude, ChatGPT, Gemini 중 선택해 프롬프트 고도화
- **사용량 제한** — Supabase에 요청을 기록하고 IP(SHA-256 해시)당 하루 횟수를 제한

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Styling | Tailwind CSS 4, Pretendard 폰트 |
| AI SDK | `@anthropic-ai/sdk`, `openai`, `@google/genai` |
| DB | Supabase (`@supabase/supabase-js`) |

## 프로젝트 구조

```
ai-prompt-kit/
├── app/
│   ├── layout.js            # 공통 레이아웃 (헤더·푸터·메타데이터)
│   ├── page.js              # 홈: 카테고리 검색 & 이용 방법
│   ├── globals.css          # 전역 스타일
│   ├── prompts/
│   │   └── [recipe]/page.js # /prompts/image, /prompts/writing … 작업별 빌더 (lib/recipes에 등록된 작업만)
│   ├── _assets/logo.png     # 헤더 로고
│   └── api/
│       └── refine/route.js  # POST /api/refine — AI 프롬프트 다듬기
├── components/
│   ├── Header.js            # 상단 헤더 / 내비게이션
│   ├── CategoryIcon.js      # 카테고리 아이콘 (SVG)
│   ├── OptionGroup.js       # RadioGroup, SelectField, TextField, FIELDS 정의대로 그리는 OptionFields
│   ├── PromptBuilder.js     # 빌더 화면 공통 틀 (소개·AI로 다듬기·결과)
│   ├── PromptBox.js         # 결과 표시 & 복사 버튼
│   └── ShareMenu.js         # 복사 / 다른 AI에서 열기 메뉴
├── lib/
│   ├── ai.js                # Claude / GPT / Gemini 호출 (게이트웨이 경유)
│   ├── fields.js            # FIELDS 정의 도우미 (기본값·서버 값 검사)
│   ├── recipes/             # 작업별 화면 문구·옵션(FIELDS)·기본 프롬프트·AI 시스템 프롬프트
│   │   ├── index.js         # 레시피 목록 (API에서 사용)
│   │   ├── image.js         # AI 이미지
│   │   ├── writing.js       # AI 글쓰기
│   │   ├── business.js      # AI 업무
│   │   ├── study.js         # AI 학습
│   │   ├── life.js          # AI 일상
│   │   └── content.js       # AI 콘텐츠
│   ├── korean.js            # 을/를 같은 한국어 도우미
│   ├── categories.js        # 홈 카테고리 & 이용 단계
│   ├── options.js           # AI 선택지 (Claude·ChatGPT·Gemini)
│   └── supabase.js          # 사용 기록 저장 & 일일 횟수 조회
├── public/                  # 정적 파일
├── .env.example             # 환경변수 예시
└── next.config.mjs
```

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 `.env.local`로 복사한 뒤 값을 채웁니다.

```bash
cp .env.example .env.local
```

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_MODEL` | Claude 사용 시 | Claude 인증 토큰(Bearer) / 모델명 |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | GPT 사용 시 | OpenAI API 키 / 모델명 |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Gemini 사용 시 | Gemini API 키 / 모델명 |
| `ANTHROPIC_BASE_URL`, `OPENAI_BASE_URL`, `GEMINI_BASE_URL` | 선택 | 생략 시 `https://api.baze.co/v1/gateway` 게이트웨이 사용 |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | 선택 | 생략 시 기록·횟수 제한 없이 동작 |
| `DAILY_LIMIT` | 선택 | IP당 하루 AI 다듬기 횟수 (기본 `20`) |

> ⚠️ 모든 키는 서버(API Route)에서만 사용됩니다. `NEXT_PUBLIC_` 접두사를 붙이지 마세요.

### 3. Supabase 테이블 (선택)

사용 기록과 횟수 제한을 쓰려면 `prompt_logs` 테이블을 만듭니다.

```sql
create table prompt_logs (
  id          bigint generated always as identity primary key,
  ip_hash     text        not null,
  provider    text        not null,
  type        text,
  style       text,
  bg          text,
  ratio       text,
  memo        text,
  result      text,
  created_at  timestamptz not null default now()
);

create index prompt_logs_ip_created_idx on prompt_logs (ip_hash, created_at);

-- 서버에서 secret 키로만 접근하므로 RLS를 켜고 공개 정책은 만들지 않습니다.
alter table prompt_logs enable row level security;
```

## API

### `POST /api/refine`

```json
{
  "recipe": "image | writing | business | study | life | content",
  "provider": "claude | gpt | gemini",
  "type": "profile | thumb | product",
  "style": "자연스러운 실사",
  "bg": "아이보리 스튜디오",
  "ratio": "1:1 | 16:9 | 9:16",
  "memo": "카페홍보용 프로필, 따뜻한 분위기"
}
```

| 상태 | 의미 |
| --- | --- |
| `200` | `{ "prompt": "..." }` |
| `400` | 잘못된 옵션 값 또는 빈 요청 |
| `429` | 하루 사용 횟수 초과 |
| `500` | 서버 환경변수 누락 |
| `502` | AI 응답 실패 |

위 예시는 `image` 기준이며, 다른 레시피는 각 파일의 `FIELDS`에 정의된 옵션 id(예: `writing`은 `type`, `style`, `purpose`, `length`)와 `memo`를 보냅니다.
옵션 값은 `lib/recipes/`에 정의된 값만 허용되며, `memo`는 최대 200자입니다.

