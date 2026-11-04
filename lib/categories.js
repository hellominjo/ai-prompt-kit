// href가 있는 작업만 바로 열리고, 나머지는 "준비 중"으로 표시돼요
export const CATEGORIES = [
  { id: "image", name: "AI 이미지", en: "Image", href: "/prompts/image",
    desc: "프로필·썸네일·상품 이미지", keys: "이미지 사진 프로필 썸네일 상품 그림 image photo" },
  { id: "write", name: "AI 글쓰기", en: "Writing", href: "/prompts/writing",
    desc: "블로그·이메일·자기소개서", keys: "글 글쓰기 블로그 문장 자기소개서 자소서 이메일 메일" },
  { id: "work", name: "AI 업무", en: "Work", href: "/prompts/business",
    desc: "보고서·회의록·기획서", keys: "업무 보고서 회의 회의록 엑셀 기획 기획서 문서" },
  { id: "study", name: "AI 학습", en: "Study", href: "/prompts/study",
    desc: "요약·시험 대비·외국어", keys: "학습 공부 요약 시험 영어 단어 강의" },
  { id: "life", name: "AI 일상", en: "Daily", href: "/prompts/life",
    desc: "여행·요리·일정 계획", keys: "일상 여행 요리 레시피 일정 운동 선물" },
  { id: "content", name: "AI 콘텐츠", en: "Content", href: "/prompts/content",
    desc: "유튜브·인스타·카드뉴스", keys: "콘텐츠 유튜브 인스타 숏폼 릴스 카드뉴스 카피 마케팅 광고" },
];

export const STEPS = [
  { title: "작업 고르기", desc: "이미지, 글쓰기, 업무처럼 지금 필요한 작업을 골라요." },
  { title: "옵션과 한 줄 요청", desc: "스타일과 비율을 고르고 원하는 걸 한 줄로 적어요." },
  { title: "복사해서 붙여넣기", desc: "완성된 프롬프트를 ChatGPT, Gemini 같은 AI에 붙여넣어요." },
];