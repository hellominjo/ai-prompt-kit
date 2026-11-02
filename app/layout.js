import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "AI 프롬프트 레시피",
  description: "필요한 순간, 꺼내 쓰는 AI 프롬프트. 옵션을 고르고 한 줄만 적으면 완성돼요.",
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