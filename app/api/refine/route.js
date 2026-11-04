import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { refine, missingEnv } from "@/lib/ai";
import { PROVIDERS } from "@/lib/options";
import { RECIPES } from "@/lib/recipes";
import { parseOptions } from "@/lib/fields";
import { countToday, logPrompt } from "@/lib/supabase";

const DAILY_LIMIT = Number(process.env.DAILY_LIMIT ?? 20);
const fail = (error, status) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("요청 형식이 올바르지 않아요.", 400);
  }

  const { provider } = body;
  const recipe = Object.hasOwn(RECIPES, body.recipe) ? RECIPES[body.recipe] : null;
  const memo = String(body.memo ?? "").trim().slice(0, 200);

  // 화면에 있는 값만 허용
  if (!recipe) return fail("지원하지 않는 작업이에요.", 400);
  if (!PROVIDERS.some((p) => p.id === provider)) return fail("AI를 다시 선택해 주세요.", 400);
  const opts = parseOptions(recipe.FIELDS, body);
  if (!opts) return fail("옵션 값이 올바르지 않아요. 새로고침 후 다시 시도해 주세요.", 400);

  if (!memo) return fail("다듬을 내용을 한 줄 적어 주세요.", 400);

  const missing = missingEnv(provider);
  if (missing.length) return fail(`서버에 ${missing.join(", ")} 값이 설정되지 않았어요.`, 500);

  // 하루 사용 횟수 제한 (IP는 암호화해서 저장)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const ipHash = createHash("sha256").update(ip).digest("hex");
  if ((await countToday(ipHash)) >= DAILY_LIMIT) {
    return fail(`오늘 사용 가능 횟수(${DAILY_LIMIT}회)를 모두 썼어요. 내일 다시 이용해 주세요.`, 429);
  }

  try {
    const result = (await refine(provider, recipe.SYSTEM_PROMPT, recipe.buildRefineInput({ ...opts, memo }))).trim();
    if (!result) throw new Error("빈 응답");

    // 테이블에 있는 열만 기록해요 (글쓰기는 bg·ratio가 비어 있어요)
    const { type, style, bg, ratio } = opts;
    await logPrompt({ ip_hash: ipHash, provider, type, style, bg, ratio, memo, result });
    return NextResponse.json({ prompt: result });
  } catch (err) {
    console.error(`[${provider}] 다듬기 실패:`, err);
    return fail("AI 응답을 받지 못했어요. 잠시 후 다시 시도하거나 다른 AI를 골라 주세요.", 502);
  }
}
