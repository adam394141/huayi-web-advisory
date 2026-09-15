import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getBearer, isAdminId } from "./admin-policy";

export async function verifyAdmin(request: Request) {
  const token = getBearer(request.headers.get("authorization"));
  if (!token) return { status: 401 as const };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !process.env.CMS_ADMIN_USER_IDS) return { status: 503 as const };
  // 使用使用者自身 JWT，不能以 service role 繞過資料庫權限。
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userError } = await client.auth.getUser(token);
  if (userError || !userData.user) return { status: 401 as const };
  if (!isAdminId(userData.user.id, process.env.CMS_ADMIN_USER_IDS)) return { status: 403 as const };
  // getClaims 驗證簽章；不可僅 base64 decode 就信任 aal。
  const { data, error } = await client.auth.getClaims(token);
  if (error || data?.claims.sub !== userData.user.id || data.claims.aal !== "aal2") return { status: 403 as const };
  return { status: 200 as const, client, userId: userData.user.id };
}
