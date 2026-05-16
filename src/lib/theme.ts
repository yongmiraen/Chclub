export type Tone = {
  bg: string;
  ring: string;
  text: string;
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
