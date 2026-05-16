export type CategoryGroup = "신앙" | "취미";

export type Category = {
  slug: string;
  label: string;
  group: CategoryGroup;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { slug: "bible", label: "성경공부", group: "신앙", emoji: "📖" },
  { slug: "prayer", label: "기도모임", group: "신앙", emoji: "🙏" },
  { slug: "worship", label: "찬양", group: "신앙", emoji: "🎵" },
  { slug: "qt", label: "큐티·말씀나눔", group: "신앙", emoji: "✝️" },
  { slug: "service", label: "봉사", group: "신앙", emoji: "🤝" },

  { slug: "sports", label: "운동", group: "취미", emoji: "⚽" },
  { slug: "book", label: "독서", group: "취미", emoji: "📚" },
  { slug: "food", label: "음식·맛집", group: "취미", emoji: "🍱" },
  { slug: "music", label: "음악", group: "취미", emoji: "🎸" },
  { slug: "culture", label: "영화·문화", group: "취미", emoji: "🎬" },
  { slug: "travel", label: "여행", group: "취미", emoji: "🧳" },
  { slug: "boardgame", label: "보드게임", group: "취미", emoji: "🎲" },
  { slug: "etc", label: "기타", group: "취미", emoji: "✨" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<string, Category>;

export function categoryLabel(slug: string) {
  return CATEGORY_MAP[slug]?.label ?? slug;
}

export function categoryEmoji(slug: string) {
  return CATEGORY_MAP[slug]?.emoji ?? "•";
}
