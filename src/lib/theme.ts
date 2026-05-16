// 카테고리별 시각 톤 — 썸네일·아이콘 배경에 사용.
// 그라데이션 대신 단색으로 단순하고 정돈된 인상 (토스 그래픽 가이드 적용).

export type Tone = {
  bg: string;        // 라이트 배경
  darkBg: string;    // 다크 배경
  ring: string;      // 라이트 테두리
  darkRing: string;  // 다크 테두리
  text: string;      // 라이트 텍스트
};

const T = {
  amber:   { bg: "bg-amber-100",   darkBg: "dark:bg-amber-900/40",   ring: "ring-amber-200",   darkRing: "dark:ring-amber-700/50",   text: "text-amber-800"   },
  rose:    { bg: "bg-rose-100",    darkBg: "dark:bg-rose-900/40",    ring: "ring-rose-200",    darkRing: "dark:ring-rose-700/50",    text: "text-rose-800"    },
  violet:  { bg: "bg-violet-100",  darkBg: "dark:bg-violet-900/40",  ring: "ring-violet-200",  darkRing: "dark:ring-violet-700/50",  text: "text-violet-800"  },
  sky:     { bg: "bg-sky-100",     darkBg: "dark:bg-sky-900/40",     ring: "ring-sky-200",     darkRing: "dark:ring-sky-700/50",     text: "text-sky-800"     },
  emerald: { bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/40", ring: "ring-emerald-200", darkRing: "dark:ring-emerald-700/50", text: "text-emerald-800" },
  orange:  { bg: "bg-orange-100",  darkBg: "dark:bg-orange-900/40",  ring: "ring-orange-200",  darkRing: "dark:ring-orange-700/50",  text: "text-orange-800"  },
  lime:    { bg: "bg-lime-100",    darkBg: "dark:bg-lime-900/40",    ring: "ring-lime-200",    darkRing: "dark:ring-lime-700/50",    text: "text-lime-800"    },
  pink:    { bg: "bg-pink-100",    darkBg: "dark:bg-pink-900/40",    ring: "ring-pink-200",    darkRing: "dark:ring-pink-700/50",    text: "text-pink-800"    },
  indigo:  { bg: "bg-indigo-100",  darkBg: "dark:bg-indigo-900/40",  ring: "ring-indigo-200",  darkRing: "dark:ring-indigo-700/50",  text: "text-indigo-800"  },
  teal:    { bg: "bg-teal-100",    darkBg: "dark:bg-teal-900/40",    ring: "ring-teal-200",    darkRing: "dark:ring-teal-700/50",    text: "text-teal-800"    },
  stone:   { bg: "bg-stone-100",   darkBg: "dark:bg-stone-800",      ring: "ring-stone-200",   darkRing: "dark:ring-stone-600",      text: "text-stone-700"   },
} as const satisfies Record<string, Tone>;

export const TONE_BY_CATEGORY: Record<string, Tone> = {
  bible:     T.amber,
  prayer:    T.rose,
  worship:   T.violet,
  qt:        T.orange,
  service:   T.pink,

  sports:    T.emerald,
  book:      T.sky,
  food:      T.orange,
  music:     T.violet,
  culture:   T.indigo,
  travel:    T.teal,
  boardgame: T.lime,
  etc:       T.stone,
};

export function toneFor(slug: string): Tone {
  return TONE_BY_CATEGORY[slug] ?? T.stone;
}
