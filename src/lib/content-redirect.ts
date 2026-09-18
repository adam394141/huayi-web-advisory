import "server-only";
import { getReadOnlyClient } from "./supabase";

export async function getContentRedirect(oldPath: string): Promise<string | null> {
  if (!/^\/blog\/[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(oldPath)) return null;
  const client = getReadOnlyClient();
  const { data } = await client.from("content_redirects").select("new_path,content_id").eq("old_path", oldPath).maybeSingle();
  if (typeof data?.new_path !== "string" || !/^\/blog\/[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(data.new_path)) return null;
  const { data: post } = await client.from("blog_posts").select("id").eq("id", data.content_id).eq("status", "published").maybeSingle();
  return post ? data.new_path : null;
}
