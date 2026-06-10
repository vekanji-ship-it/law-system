-- ================================================
-- 在 Supabase > SQL Editor 執行這段
-- ================================================

-- 1. 建立 licenses 資料表
CREATE TABLE IF NOT EXISTS licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  license_key TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT true,
  email TEXT,
  lemonsqueezy_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- 2. 開啟 Row Level Security
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- 3. 用戶只能看到自己的授權記錄
CREATE POLICY "Users can view own licenses"
  ON licenses FOR SELECT
  USING (auth.uid() = user_id);

-- 4. 允許用戶更新（綁定 user_id）
CREATE POLICY "Users can claim unowned licenses"
  ON licenses FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id);

-- 5. Service Role 可以做任何事（Webhook 用）
-- 注意：使用 Service Role Key 不受 RLS 限制，不需要額外設定

-- 6. 查看已建立的 licenses（測試用）
-- SELECT * FROM licenses;

-- 7. 手動新增測試授權碼（測試用）
-- INSERT INTO licenses (license_key, plan, is_active, email, expires_at)
-- VALUES ('KM-TEST-1234-ABCD', 'monthly', true, 'test@test.com', NOW() + INTERVAL '1 month');
