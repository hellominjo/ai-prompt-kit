import Link from "next/link";
import { GUIDES, findGuide } from "@/lib/guides";
import { RECIPES } from "@/lib/recipes";
import { SITE_URL } from "@/lib/site";

// lib/guides.js에 있는 글만 페이지로 만들고, 나머지 주소는 404예요
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = findGuide(slug);
  const url = `/guide/${slug}`;
  return {
    title: g.title,
    description: g.desc,
    alternates: { canonical: url },
    openGraph: { type: "article", title: `${g.title} | PROMKIT`, description: g.desc, url },
  };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const g = findGuide(slug);
  const index = GUIDES.indexOf(g);
  const next = GUIDES[index + 1];
  const related = RECIPES[g.related];

  // 검색 결과에 글 정보를 알려주는 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.desc,
    inLanguage: "ko",
    mainEntityOfPage: `${SITE_URL}/guide/${slug}`,
    publisher: { "@type": "Organization", name: "PROMKIT" },
  };

  return (
    <article className="guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/guide" className="back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m15 6-6 6 6 6" />
        </svg>
        가이드 목록
      </Link>

      <header className="guide-head">
        <span className="eyebrow">가이드 {String(index + 1).padStart(2, "0")} · 약 {g.minutes}분</span>
        <h1>{g.title}</h1>
        <p>{g.desc}</p>
      </header>

      {g.sections.map((s) => (
        <section key={s.h} className="guide-section">
          <h2>{s.h}</h2>
          {s.p?.map((text) => <p key={text}>{text}</p>)}
          {s.list && (
            <ul>
              {s.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
          {s.example && (
            <div className="guide-example">
              <div className="is-bad">
                <span>이렇게 쓰면</span>
                <pre>{s.example.bad}</pre>
              </div>
              <div className="is-good">
                <span>이렇게 바꿔 보세요</span>
                <pre>{s.example.good}</pre>
              </div>
              {s.example.note && <p className="guide-note">{s.example.note}</p>}
            </div>
          )}
        </section>
      ))}

      <footer className="guide-foot">
        {related && (
          <Link href={`/prompts/${related.ID}`} className="btn-primary">
            {related.PAGE.title} →
          </Link>
        )}
        {next && (
          <Link href={`/guide/${next.slug}`} className="guide-next">
            <small>다음 가이드</small>
            <strong>{next.title}</strong>
          </Link>
        )}
      </footer>
    </article>
  );
}
