// 僅 SELECT／Storage list／HEAD，不寫入 CMS 或 Storage。
import { createClient } from "@supabase/supabase-js";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data: works, error } = await db.from("works").select("slug,title,category,cover_image,hero_image").eq("status", "published");
if (error) throw error;
const results = [];
for (const work of works) {
  const { data: files, error: listError } = await db.storage.from("published-assets").list(`works/${work.slug}/original`, { limit: 200 });
  if (listError) throw listError;
  const images = (files || []).filter(f => /\.(png|jpe?g|webp|gif|svg)$/i.test(f.name));
  const urls = [...new Set([work.cover_image, work.hero_image, ...images.map(f =>
    db.storage.from("published-assets").getPublicUrl(`works/${work.slug}/original/${f.name}`).data.publicUrl)].filter(Boolean))];
  const failures = [];
  for (let i = 0; i < urls.length; i += 6) {
    await Promise.all(urls.slice(i, i + 6).map(async url => {
      try {
        const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
        if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) failures.push({ url, status: response.status });
      } catch { failures.push({ url, status: "network-error" }); }
    }));
  }
  results.push({ slug: work.slug, category: work.category, imageCount: images.length, checked: urls.length, failures });
}
console.log(JSON.stringify({ works: results.length, checked: results.reduce((n,r)=>n+r.checked,0), results }, null, 2));
if (results.some(r=>r.failures.length)) process.exitCode = 1;
