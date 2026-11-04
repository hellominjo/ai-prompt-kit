import Link from "next/link";
import { GUIDES } from "@/lib/guides";

const DESC = "좋은 프롬프트의 구성 요소부터 형식 지정, 예시 활용, 틀린 정보 줄이기까지. 바로 따라 쓰는 AI 프롬프트 작성 가이드예요.";

export const metadata = {
  title: "프롬프트 작성 가이드",
  description: DESC,
  alternates: { canonical: "/guide" },
  openGraph: { type: "website", title: "프롬프트 작성 가이드 | PROMKIT", description: DESC, url: "/guide" },
};

export default function GuideList() {
  return (
    <div className="hero">
      <div className="hero-copy">
        <h1>프롬프트 작성 가이드</h1>
        <p>{DESC}</p>
      </div>

      <div className="block-head">
        <h2>가이드 목록</h2>
        <span>{GUIDES.length}개 글</span>
      </div>
      <ol className="guide-list">
        {GUIDES.map((g, i) => (
          <li key={g.slug}>
            <Link href={`/guide/${g.slug}`} className="guide-card">
              <span className="guide-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="guide-card-body">
                <strong>{g.title}</strong>
                <span>{g.desc}</span>
                <small>약 {g.minutes}분</small>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
