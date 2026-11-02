import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// 모든 AI 호출은 baze 게이트웨이를 거쳐요
const GATEWAY_URL = "https://api.baze.co/v1/gateway";

const REQUIRED_ENV = {
  claude: ["ANTHROPIC_AUTH_TOKEN", "CLAUDE_MODEL"],
  gpt: ["OPENAI_API_KEY", "OPENAI_MODEL"],
  gemini: ["GEMINI_API_KEY", "GEMINI_MODEL"],
};

// 빠진 환경변수 이름 목록 (테스트할 때 원인 찾기용)
export function missingEnv(provider) {
  return (REQUIRED_ENV[provider] ?? []).filter((key) => !process.env[key]);
}

export async function refine(provider, system, input) {
  if (provider === "claude") {
    const client = new Anthropic({
      apiKey: null, // 게이트웨이는 Bearer 토큰(authToken)으로 인증해요
      authToken: process.env.ANTHROPIC_AUTH_TOKEN,
      baseURL: process.env.ANTHROPIC_BASE_URL || `${GATEWAY_URL}/claude`,
    });
    const res = await client.messages.create({
      model: process.env.CLAUDE_MODEL,
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: input }],
    });
    return res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  }

  if (provider === "gpt") {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || GATEWAY_URL,
    });
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: input },
      ],
    });
    return res.choices[0]?.message?.content ?? "";
  }

  if (provider === "gemini") {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { baseUrl: process.env.GEMINI_BASE_URL || `${GATEWAY_URL}/gemini` },
    });
    const res = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: input,
      config: { systemInstruction: system },
    });
    return res.text ?? "";
  }

  throw new Error(`지원하지 않는 AI예요: ${provider}`);
}