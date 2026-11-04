import "./globals.css";
import Header from "@/components/Header";
import { SITE_URL, INDEXABLE } from "@/lib/site";

// 하위 페이지는 title만 주면 "○○ | PROMKIT"이 되고, canonical·og는 각 페이지에서 덮어써요
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI 프롬프트 가이드북 | PROMKIT",
    template: "%s | PROMKIT",
  },
  description:
    "AI 프롬프트 가이드북 PROMKIT. 글쓰기, 취업, 업무, 학습 등 상황별 ChatGPT 프롬프트 예시를 살펴보고 나만의 AI 프롬프트를 만들어 보세요.",
  robots: { index: INDEXABLE, follow: INDEXABLE },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "AI 프롬프트 가이드북 | PROMKIT",
    description: "상황별 AI 프롬프트를 찾고 직접 만드는 프롬프트 가이드북",
    url: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <Header />
        <main className="wrap main">{children}</main>
        <footer className="footer">
          <div className="wrap">
            AI 프롬프트 레시피 · 완성된 프롬프트를 ChatGPT, Gemini 같은 AI에 붙여넣어 사용하세요.
          </div>
        </footer>
      </body>
    </html>
  );
}