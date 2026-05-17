-- 기존 시/도 단위 또는 동 단위 region 값을 구 단위로 정리
-- 동 → 구 매핑 예시 (필요시 추가)
UPDATE groups SET region = '종로구' WHERE region IN ('안국', '종로', '광화문', '인사동', '혜화');
UPDATE groups SET region = '중구'   WHERE region IN ('명동', '을지로', '동대문');
UPDATE groups SET region = '용산구' WHERE region IN ('이태원', '한남', '용산');
UPDATE groups SET region = '마포구' WHERE region IN ('홍대', '합정', '상수', '망원');
UPDATE groups SET region = '강남구' WHERE region IN ('강남', '압구정', '청담', '역삼', '논현');
UPDATE groups SET region = '서초구' WHERE region IN ('서초', '방배', '반포');
UPDATE groups SET region = '송파구' WHERE region IN ('잠실', '문정', '가락');
UPDATE groups SET region = '성동구' WHERE region IN ('성수', '왕십리');
UPDATE groups SET region = '영등포구' WHERE region IN ('여의도', '영등포');

-- 시/도 단위 "서울" → 종로구로 임시 매핑 (방장이 직접 수정 권장)
-- UPDATE groups SET region = '종로구' WHERE region = '서울';
