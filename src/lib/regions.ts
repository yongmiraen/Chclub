export type RegionGroup = {
  label: string;
  regions: string[];
};

export const REGION_GROUPS: RegionGroup[] = [
  {
    label: "수도권",
    regions: ["서울", "경기", "인천"],
  },
  {
    label: "영남",
    regions: ["부산", "대구", "울산", "경남", "경북"],
  },
  {
    label: "호남",
    regions: ["광주", "전남", "전북"],
  },
  {
    label: "충청",
    regions: ["대전", "세종", "충남", "충북"],
  },
  {
    label: "강원 · 제주",
    regions: ["강원", "제주"],
  },
  {
    label: "기타",
    regions: ["온라인"],
  },
];

export const ALL_REGIONS = REGION_GROUPS.flatMap((g) => g.regions);
