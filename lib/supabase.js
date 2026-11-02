import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

// 키가 없으면 null → 기록과 횟수 제한을 건너뛰어요
const supabase = url && key
  ? createClient(url, key, { auth: { persistSession: false } })
  : null;

// 한국 시간 기준 오늘 0시
function todayStartKST() {
  const kst = new Date(Date.now() + 9 * 3600 * 1000);
  kst.setUTCHours(0, 0, 0, 0);
  return new Date(kst.getTime() - 9 * 3600 * 1000);
}

export async function countToday(ipHash) {
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from("prompt_logs")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", todayStartKST().toISOString());
  if (error) {
    console.error("Supabase 조회 실패:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function logPrompt(row) {
  if (!supabase) return;
  const { error } = await supabase.from("prompt_logs").insert(row);
  if (error) console.error("Supabase 저장 실패:", error.message);
}