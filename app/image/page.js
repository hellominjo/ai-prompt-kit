"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TYPES, STYLES, BGS, RATIOS, PROVIDERS } from "@/lib/options";
import { buildPrompt } from "@/lib/buildPrompt";
import { RadioGroup, SelectField } from "@/components/OptionGroup";
import PromptBox from "@/components/PromptBox";
import ShareMenu from "@/components/ShareMenu";

export default function ImageBuilder() {
  const [type, setType] = useState(TYPES[0].id);
  const [style, setStyle] = useState(STYLES[0]);
  const [bg, setBg] = useState(BGS[0]);
  const [ratio, setRatio] = useState(TYPES[0].ratio);
  const [memo, setMemo] = useState("");
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [ai, setAi] = useState(null); // { text, by }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const providerName = PROVIDERS.find((p) => p.id === provider).name;
  // 고른 용도에 맞는 예시를 입력칸에 보여줘요
  const memoPlaceholder = TYPES.find((t) => t.id === type).placeholder;
  const basePrompt = useMemo(
    () => buildPrompt({ type, style, bg, ratio, memo }),
    [type, style, bg, ratio, memo]
  );
  const output = ai ? ai.text : basePrompt;

  // 옵션을 바꾸면 AI 결과를 지우고 기본 프롬프트로 돌아가요
  const withReset = (setter) => (value) => {
    setter(value);
    setAi(null);
    setError("");
  };

  function changeType(id) {
    setType(id);
    setRatio(TYPES.find((t) => t.id === id).ratio);
    setAi(null);
    setError("");
  }

  async function refineWithAI() {
    if (!memo.trim()) {
      setError(`다듬을 내용을 한 줄 적어 주세요. ${memoPlaceholder}`);
      document.getElementById("memo")?.focus();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, type, style, bg, ratio, memo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "AI 다듬기에 실패했어요.");
      setAi({ text: data.prompt, by: providerName });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="builder">
      <div className="panel">
        <div className="panel-section intro">
          <Link href="/" className="back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
            홈으로
          </Link>
          <h1>AI 이미지 프롬프트 만들기</h1>
          <ul className="meta">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
              </svg>
              약 1분
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
              </svg>
              Claude · ChatGPT · Gemini
            </li>
          </ul>
          <p>옵션을 고르고 한 줄만 적으면 이미지 생성용 프롬프트가 완성돼요.</p>
        </div>

        <div className="panel-section">
          <RadioGroup
            legend="무엇을 만들고 싶나요?"
            name="type"
            className="types"
            value={type}
            onChange={changeType}
            options={TYPES.map((t) => ({ value: t.id, label: t.name, hint: t.hint }))}
          />

          <div className="pair">
            <SelectField id="style" label="이미지 스타일" options={STYLES} value={style} onChange={withReset(setStyle)} />
            <SelectField id="bg" label="배경" options={BGS} value={bg} onChange={withReset(setBg)} />
          </div>

          <RadioGroup
            legend="이미지 비율"
            name="ratio"
            row
            value={ratio}
            onChange={withReset(setRatio)}
            options={RATIOS.map((r) => ({
              value: r.value,
              label: r.value,
              extra: <span className="ratio-shape" style={{ width: r.w, height: r.h }} />,
            }))}
          />

          <div className="field">
            <label className="label" htmlFor="memo">한 줄 요청</label>
            <input
              id="memo"
              className="field-input"
              type="text"
              maxLength={200}
              placeholder={memoPlaceholder}
              value={memo}
              onChange={(e) => withReset(setMemo)(e.target.value)}
            />
          </div>

          <div className="ai-panel">
            <RadioGroup
              legend="AI로 다듬기"
              name="provider"
              row
              value={provider}
              onChange={setProvider}
              options={PROVIDERS.map((p) => ({ value: p.id, label: p.name }))}
            />
            <button type="button" className="btn-primary" onClick={refineWithAI} disabled={loading || !memo.trim()} aria-busy={loading}>
              {loading ? "다듬는 중…" : "프롬프트 다듬기"}
            </button>
            {error && <p className="error" role="alert">{error}</p>}
          </div>
        </div>
      </div>

      <aside className="panel result" aria-label="완성된 프롬프트">
        <div className="result-head">
          <h2 className="result-title">완성된 프롬프트</h2>
          <ShareMenu text={output} disabled={loading} />
        </div>
        <PromptBox
          text={output}
          badge={ai ? `${ai.by}가 다듬은 프롬프트` : "자동 생성 프롬프트"}
          loading={loading}
          onReset={ai ? () => setAi(null) : null}
        />
      </aside>
    </div>
  );
}