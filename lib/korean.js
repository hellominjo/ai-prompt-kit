// 받침 유무에 따라 을/를 붙이기
export function withEul(word) {
  const code = word.trim().slice(-1).charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return `${word}을(를)`;
  return word + ((code - 0xac00) % 28 ? "을" : "를");
}
