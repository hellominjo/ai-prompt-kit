"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, STEPS } from "@/lib/categories";
import CategoryIcon from "@/components/CategoryIcon";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  // "AI 이미지"처럼 앞에 AI를 붙여 검색해도 찾을 수 있게 해요
  const list = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^ai\s*/, "");
    return CATEGORIES.filter((c) => !q || `${c.name} ${c.keys}`.toLowerCase().includes(q));
  }, [query]);

  function open(c) {
    setSelected(c.id);
    if (c.href) {
      router.push(c.href);
      return;
    }
    setToast(`${c.name} 레시피는 준비 중이에요.`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2200);
  }

  return (
    <>
      <div className="hero">
        <div className="hero-copy">       
          <h1>필요한 순간, 바로 꺼내 쓰는 AI 프롬프트</h1>
          <p>상황에 맞는 프롬프트를 찾고, 복사하고, 바로 활용하세요.</p>
        </div>

        <div className="search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="search"
            type="search"
            autoComplete="off"
            aria-label="AI 작업 검색"
            placeholder="어떤 AI 작업이 필요하신가요?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && list.length === 1) open(list[0]);
            }}
          />
        </div>

        <div className="block-head">
          <h2>어떤 작업을 할까요?</h2>
          <span>{list.length}개 작업</span>
        </div>

        {list.length > 0 ? (
          <div className="tiles">
            {list.map((c) => {
              const classes = ["tile", c.href && "is-ready", selected === c.id && "is-selected"]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  key={c.id}
                  type="button"
                  className={classes}
                  aria-pressed={selected === c.id}
                  onClick={() => open(c)}
                >
                  <span className="tile-top">
                    <span className="tile-icon"><CategoryIcon id={c.id} /></span>
                    <span className="tile-en">{c.en}</span>
                  </span>
                  <span className="tile-name">{c.name}</span>
                  <span className="tile-desc">{c.desc}</span>
                  <span className="tile-foot">
                    {c.href ? "시작하기" : "준비 중"}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="empty">찾는 작업이 아직 없어요. 이미지, 글쓰기, 업무처럼 짧게 검색해 보세요.</p>
        )}

        <div className="divider" role="presentation" />

        <div className="block-head">
          <h2>어떻게 이용하나요?</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step-head">
                <span className="step-dot">{i + 1}</span>
                <span className="step-num">STEP {i + 1}</span>
              </span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}