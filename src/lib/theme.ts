// 카테고리별 시각 톤 — 썸네일·아이콘 배경에 사용.
// 신앙 계열은 따뜻한 amber/rose, 취미는 카테고리별로 다채롭게.

export type Tone = {
  // tailwind 그라데이션 (썸네일·원형 아이콘 공용)
  bg: string;
  // 원형 아이콘 안의 이모지 톤 (필요 시 글자색)
  text: string;
};

const T = {
  amber: { bg: "from-amber-100 to-amber-300", text: "text-amber-900" },
  rose: { bg: "from-rose-100 to-rose-300", text: "text-rose-900" },
  violet: { bg: "from-violet-100 to-violet-300", text: "text-violet-900" },
  sky: { bg: "from-sky-100 to-sky-300", text: "text-sky-900" },
  emerald: { bg: "from-emerald-100 to-emerald-300", text: "text-emerald-900" },
  orange: { bg: "from-orange-100 to-orange-300", text: "text-orange-900" },
  lime: { bg: "from-lime-100 to-lime-300", text: "text-lime-900" },
  pink: { bg: "from-pink-100 to-pink-300", text: "text-pink-900" },
  indigo: { bg: "from-indigo-100 to-indigo-300", text: "text-indigo-900" },
  teal: { bg: "from-teal-100 to-teal-300", text: "text-teal-900" },
  stone: { bg: "from-stone-100 to-stone-300", text: "text-stone-900" },
} as const satisfies Record<string, Tone>;

export const TONE_BY_CATEGORY: Record<string, Tone> = {
  bible: T.amber,
  prayer: T.rose,
  worship: T.violet,
  qt: T.orange,
  service: T.pink,

  sports: T.emerald,
  book: T.sky,
  food: T.orange,
  music: T.violet,
  culture: T.indigo,
  travel: T.teal,
  boardgame: T.lime,
  etc: T.stone,
};

export function toneFor(slug: string): Tone {
  return TONE_BY_CATEGORY[slug] ?? T.stone;
}
