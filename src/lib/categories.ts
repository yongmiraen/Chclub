export type CategoryGroup = "신앙" | "삶·취미";

export type Category = {
  slug: string;
  label: string;
  group: CategoryGroup;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  // 신앙
  { slug: "bible",   label: "성경공부",    group: "신앙",   emoji: "📖" },
  { slug: "prayer",  label: "기도모임",    group: "신앙",   emoji: "🙏" },
  { slug: "worship", label: "찬양",        group: "신앙",   emoji: "🎵" },
  { slug: "qt",      label: "큐티·말씀나눔", group: "신앙", emoji: "✝️" },
  { slug: "service", label: "봉사·선교",   group: "신앙",   emoji: "🤝" },

  // 삶·취미
  { slug: "sports",  label: "운동·스포츠", group: "삶·취미", emoji: "⚽" },
  { slug: "book",    label: "독서·인문학", group: "삶·취미", emoji: "📚" },
  { slug: "music",   label: "음악·악기",   group: "삶·취미", emoji: "🎸" },
  { slug: "culture", label: "영화·문화",   group: "삶·취미", emoji: "🎬" },
  { slug: "travel",  label: "여행",        group: "삶·취미", emoji: "🧳" },
  { slug: "cooking", label: "요리·베이킹", group: "삶·취미", emoji: "🍳" },
  { slug: "language",label: "언어·공부",   group: "삶·취미", emoji: "📝" },
  { slug: "photo",   label: "사진·영상",   group: "삶·취미", emoji: "📷" },
  { slug: "growth",  label: "자기계발",    group: "삶·취미", emoji: "💡" },
  { slug: "etc",     label: "기타",        group: "삶·취미", emoji: "✨" },
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
