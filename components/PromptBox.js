"use client";

import { useEffect, useRef, useState } from "react";

export default function PromptBox({ text, badge, loading, onReset }) {
  const [copied, setCopied] = useState(null);
  const textRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
    } catch {
      // 복사가 막힌 환경이면 텍스트를 선택해 줘요
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      setCopied("select");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2000);
  }

  const label =
    copied === "ok" ? "복사했어요" :
    copied === "select" ? "텍스트를 선택했어요. Ctrl+C로 복사하세요" :
    "완성된 프롬프트 복사하기";

  return (
    <>
      <section className="output" aria-live="polite" aria-busy={loading}>
        <div className="output-head">
          <span>{badge}</span>
          <em>{text.length}자</em>
        </div>
        <p ref={textRef} className={loading ? "prompt loading" : "prompt"}>{text}</p>
        {onReset && (
          <button type="button" className="link-btn" onClick={onReset}>
            기본 프롬프트로 되돌리기
          </button>
        )}
      </section>

      <button type="button" className="copy" onClick={copy} disabled={loading}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <rect x="8" y="8" width="12" height="12" rx="3" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
        {label}
      </button>
    </>
  );
}