import { SITE_URL } from "@/lib/site";
import { RECIPES } from "@/lib/recipes";
import { GUIDES } from "@/lib/guides";

// /sitemap.xml — 홈, lib/recipes의 빌더, lib/guides의 가이드 글이 자동으로 들어가요
export default function sitemap() {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...Object.keys(RECIPES).map((id) => ({
      url: `${SITE_URL}/prompts/${id}`,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    { url: `${SITE_URL}/guide`, changeFrequency: "weekly", priority: 0.7 },
    ...GUIDES.map((g) => ({
      url: `${SITE_URL}/guide/${g.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
}
