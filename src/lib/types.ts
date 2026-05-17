export type Group = {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string | null;
  max_members: number;
  creator_nickname: string;
  edit_pin_hash: string;
  created_at: string;
  image_url: string | null;
  meeting_frequency: string | null; // 매주 / 격주 / 매월 / 비정기
  meeting_day: string | null;       // 예) 토, 토·일
  meeting_time: string | null;      // 예) 10:00
};

export type Membership = {
  id: string;
  group_id: string;
  nickname: string;
  contact: string | null;
  message: string | null;
  created_at: string;
  status: "pending" | "approved";
  user_id: string | null;
};

export type GroupPost = {
  id: string;
  group_id: string;
  author_id: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
};

export type GroupWithCount = Group & { member_count: number };
