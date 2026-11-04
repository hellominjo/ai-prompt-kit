import { RECIPES } from "@/lib/recipes";
import PromptBuilder from "@/components/PromptBuilder";

// /prompts/image, /prompts/writing처럼 lib/recipes에 등록된 작업만 페이지로 만들고, 나머지 주소는 404예요
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(RECIPES).map((recipe) => ({ recipe }));
}

export async function generateMetadata({ params }) {
  const { recipe } = await params;
  const { title, desc } = RECIPES[recipe].PAGE;
  const url = `/prompts/${recipe}`;
  // 레이아웃의 canonical·og(홈 주소)를 이 페이지 주소로 덮어써요
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { type: "website", title: `${title} | PROMKIT`, description: desc, url },
  };
}

export default async function RecipePage({ params }) {
  const { recipe } = await params;
  // key: 다른 작업으로 이동하면 옵션 값을 새로 시작해요
  return <PromptBuilder key={recipe} recipeId={recipe} />;
}
