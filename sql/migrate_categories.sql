-- 삭제된 카테고리 → 가까운 카테고리로 마이그레이션
UPDATE groups SET category = 'etc'     WHERE category = 'boardgame';
UPDATE groups SET category = 'cooking' WHERE category = 'food';
