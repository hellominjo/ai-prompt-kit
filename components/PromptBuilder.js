"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PROVIDERS } from "@/lib/options";
import { initialValues } from "@/lib/fields";
import { RECIPES } from "@/lib/recipes";
import { RadioGroup, OptionFields } from "@/components/OptionGroup";
import PromptBox from "@/components/PromptBox";
import ShareMenu from "@/components/ShareMenu";

const RELOAD_KEY = "recipe-reload";

// 빌더 화면 공통 틀: 소개 + 옵션 + AI로 다듬기 + 결과
// recipeId는 lib/recipes에 등록된 작업 이름 (image, writing …)
export default function PromptBuilder({ recipeId }) {
  const recipe = RECIPES[recipeId];
  return recipe ? <Builder recipe={recipe} /> : <ReloadOnce recipeId={recipeId} />;
}

// 새 작업을 추가하기 전부터 열려 있던 탭은 예전 레시피 목록을 갖고 있어서,
// 오류 대신 페이지를 한 번만 새로 불러와요 (그래도 없으면 안내만 남겨요)
function ReloadOnce({ recipeId }) {
  useEffect(() => {
    if (sessionStorage.getItem(RELOAD_KEY) === recipeId) {
      sessionStorage.removeItem(RELOAD_KEY);
      return;
    }
    sessionStorage.setItem(RELOAD_KEY, recipeId);
    window.location.reload();
  }, [recipeId]);

  return (
    <p className="empty" role="status">
      새 버전을 불러오는 중이에요. 이 화면이 계속 보이면 새로고침해 주세요.
    </p>
  );
}

function Builder({ recipe }) {
  const [values, setValues] = useState(() => initialValues(recipe.FIELDS));
  // 새로 불러와서 제대로 열렸으면 표시를 지워요
  useEffect(() => sessionStorage.removeItem(RELOAD_KEY), []);
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [ai, setAi] = useState(null); // { text, by }
  const [error, setError] = useState(null); // { base, message }
  const [loading, setLoading] = useState(false);

  const basePrompt = recipe.buildPrompt(values);

  function changeField(field, value) {
    setValues((v) => ({ ...v, [field.id]: value, ...field.update?.(value) }));
  }

  // AI 결과는 옵션이나 요청을 고쳐도 다시 다듬거나 되돌리기 전까지 그대로 보여줘요
  // 오류는 옵션을 바꾸면 더 이상 맞지 않아서 지워요
  const errorMessage = error?.base === basePrompt ? error.message : "";
  const output = ai ? ai.text : basePrompt;

  async function refineWithAI() {
    const by = PROVIDERS.find((p) => p.id === provider).name;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: recipe.ID, provider, ...values }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "AI 다듬기에 실패했어요.");
      setAi({ text: data.prompt, by });
    } catch (e) {
      setError({ base: basePrompt, message: e.message });
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
          <h1>{recipe.PAGE.title}</h1>
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
          <p>{recipe.PAGE.desc}</p>
        </div>

        <div className="panel-section">
          <OptionFields fields={recipe.FIELDS} values={values} onChange={changeField} />

          <div className="ai-panel">
            <RadioGroup
              legend="AI로 다듬기"
              name="provider"
              row
              value={provider}
              onChange={setProvider}
              options={PROVIDERS.map((p) => ({ value: p.id, label: p.name }))}
            />
            <button type="button" className="btn-primary" onClick={refineWithAI} disabled={loading || !values.memo.trim()} aria-busy={loading}>
              {loading ? "다듬는 중…" : "프롬프트 다듬기"}
            </button>
            {errorMessage && <p className="error" role="alert">{errorMessage}</p>}
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
