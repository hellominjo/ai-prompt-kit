// 레시피의 옵션 정의(FIELDS)를 다루는 도우미. 화면과 API가 같이 써요
//
// field: { id, kind: "radio" | "select" | "text", label, options, placeholder, default, update, row, className }
// - options, placeholder: 다른 옵션 값에 따라 달라지면 (values) => ... 함수로 써요
// - default: 생략하면 첫 번째 선택지 (text는 빈 칸)
// - update: 값을 바꿀 때 함께 바꿀 다른 옵션 값을 돌려줘요. 예: (id) => ({ ratio: "16:9" })
// - { pair: [field, field] }: 두 칸을 나란히 놓아요

export const flatFields = (fields) => fields.flatMap((f) => f.pair ?? [f]);

export const resolve = (prop, values) => (typeof prop === "function" ? prop(values) : prop);

// 선택지를 { value, label } 모양으로 맞춰요 (문자열 배열도 허용)
export const optionsOf = (field, values) =>
  resolve(field.options, values).map((o) => (typeof o === "string" ? { value: o, label: o } : o));

export function initialValues(fields) {
  const values = {};
  for (const f of flatFields(fields)) {
    values[f.id] = f.default ?? (f.kind === "text" ? "" : optionsOf(f, values)[0].value);
  }
  return values;
}

// 서버에서 화면에 있는 값만 허용해요 (올바르지 않으면 null). 입력칸(text)은 따로 다듬어요
export function parseOptions(fields, body) {
  const opts = {};
  for (const f of flatFields(fields)) {
    if (f.kind === "text") continue;
    if (!optionsOf(f, body).some((o) => o.value === body[f.id])) return null;
    opts[f.id] = body[f.id];
  }
  return opts;
}
