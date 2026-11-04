export const SITE_URL = "https://promkit.zerofound.io";

// 검색엔진 색인은 실제 서비스에서만 허용해요
// Vercel 미리보기 배포(VERCEL_ENV=preview)나 개발 서버는 noindex + robots.txt 전체 차단
export const INDEXABLE = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";
