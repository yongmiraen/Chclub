// MVP: 서울 25개 구 단위 필터
// 추후 다른 도시 추가 예정

export type RegionGroup = {
  label: string;
  regions: string[];
};

export const REGION_GROUPS: RegionGroup[] = [
  {
    label: "도심",
    regions: ["종로구", "중구", "용산구"],
  },
  {
    label: "동북권",
    regions: ["성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구"],
  },
  {
    label: "서북권",
    regions: ["은평구", "서대문구", "마포구"],
  },
  {
    label: "서남권",
    regions: ["양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구"],
  },
  {
    label: "동남권",
    regions: ["서초구", "강남구", "송파구", "강동구"],
  },
  {
    label: "기타",
    regions: ["온라인"],
  },
];

export const ALL_REGIONS = REGION_GROUPS.flatMap((g) => g.regions);
