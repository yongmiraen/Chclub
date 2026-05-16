// 카테고리별 시각 톤 — 썸네일·아이콘 배경에 사용.
// 그라데이션 대신 단색으로 단순하고 정돈된 인상 (토스 그래픽 가이드 적용).

export type Tone = {
  bg: string;   // 배경 단색 (bg-*-100)
  ring: string; // 테두리 단색 (ring-*-200)
  text: string; // 텍스트 색
};

const T = {
  amber:   { bg: "bg-amber-100",   ring: "ring-amber-200",   text: "text-amber-800"   },
  rose:    { bg: "bg-rose-100",    ring: "ring-rose-200",    text: "text-rose-800"    },
  violet:  { bg: "bg-violet-100",  ring: "ring-violet-200",  text: "text-violet-800"  },
  sky:     { bg: "bg-sky-100",     ring: "ring-sky-200",     text: "text-sky-800"     },
  emerald: { bg: "bg-emerald-100", ring: "ring-emerald-200", text: "text-emerald-800" },
  orange:  { bg: "bg-orange-100",  ring: "ring-orange-200",  text: "text-orange-800"  },
  lime:    { bg: "bg-lime-100",    ring: "ring-lime-200",    text: "text-lime-800"    },
  pink:    { bg: "bg-pink-100",    ring: "ring-pink-200",    text: "text-pink-800"    },
  indigo:  { bg: "bg-indigo-100",  ring: "ring-indigo-200",  text: "text-indigo-800"  },
  teal:    { bg: "bg-teal-100",    ring: "ring-teal-200",    text: "text-teal-800"    },
  stone:   { bg: "bg-stone-100",   ring: "ring-stone-200",   text: "text-stone-700"   },
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
