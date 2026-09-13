import type { Metadata } from "next";
import { AdminConsole } from "./admin-console";

export const metadata: Metadata = { title: "內容管理｜華翼品牌策略", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminPage() {
  const configured = !!process.env.CMS_ADMIN_USER_IDS && process.env.CMS_READ_ENABLED === "true";
  return <AdminConsole configured={configured} />;
}
