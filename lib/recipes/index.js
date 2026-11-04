import * as image from "./image";
import * as writing from "./writing";
import * as business from "./business";
import * as study from "./study";
import * as life from "./life";
import * as content from "./content";

// 작업(레시피)별 설정. 새 작업은 파일을 만들고 여기에 추가하면 /prompts/<ID> 페이지가 생겨요
// 각 레시피는 ID, PAGE, FIELDS(memo 입력칸 포함), buildPrompt, SYSTEM_PROMPT, buildRefineInput을 내보내요
export const RECIPES = Object.fromEntries([image, writing, business, study, life, content].map((r) => [r.ID, r]));
