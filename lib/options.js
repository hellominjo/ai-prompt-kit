export const TYPES = [
  {
    id: "profile", name: "프로필 사진", hint: "SNS·메신저·이력서용",
    source: "참고 사진", ratio: "1:1",
    placeholder: "예: 밝게 웃는 표정, 정장 차림",
    keep: "인물의 얼굴 특징과 표정을 자연스럽게 유지하고",
  },
  {
    id: "thumb", name: "블로그 썸네일", hint: "글 대표 이미지",
    source: "참고 이미지", ratio: "16:9",
    placeholder: "예: 제주도 카페 여행 후기",
    keep: "글의 주제가 한눈에 드러나도록 구도를 잡고, 제목을 올릴 여백을 남기고",
  },
  {
    id: "product", name: "상품 홍보 이미지", hint: "스마트스토어·인스타 광고",
    source: "상품 사진", ratio: "1:1",
    placeholder: "예: 카페 홍보용, 봄 시즌 느낌",
    keep: "상품의 형태, 색상, 로고를 정확하게 유지하고",
  },
];

export const STYLES = ["자연스러운 실사", "시네마틱 조명", "미니멀 일러스트", "3D 렌더링", "필름 카메라 감성", "수채화"];
export const BGS = ["아이보리 스튜디오", "화이트 스튜디오", "그레이 그라데이션", "야외 자연광", "카페 인테리어", "도시 거리"];

export const RATIOS = [
  { value: "1:1", w: 13, h: 13 },
  { value: "16:9", w: 18, h: 10 },
  { value: "9:16", w: 10, h: 18 },
];

export const PROVIDERS = [
  { id: "claude", name: "Claude" },
  { id: "gpt", name: "ChatGPT" },
  { id: "gemini", name: "Gemini" },
];