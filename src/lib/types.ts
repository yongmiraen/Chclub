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
};

export type Membership = {
  id: string;
  group_id: string;
  nickname: string;
  contact: string | null;
  message: string | null;
  created_at: string;
};

export type GroupWithCount = Group & { member_count: number };
