import { getReadOnlyClient } from "./supabase";
import "server-only";
import { cleanContent } from "./content-safety";

// 唯讀資料適配器 — 只提供 SELECT，不含任何 mutation
// 公開 DTO 明列欄位，避免來源備註或未來新增的內部欄位進入瀏覽器。
const WORK_FIELDS = "id,title,slug,description,category,cover_image,status,sort_order,show_on_homepage,created_at,updated_at";
const POST_FIELDS = "id,title,slug,excerpt,category,cover_image,author,status,show_on_homepage,published_at,created_at,updated_at";

export interface GalleryAsset {
  src: string;
  alt: string;
  role: "hero" | "support" | "detail";
  width: number;
  height: number;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: string;
  cover_image?: string;
  hero_image?: string;
  gallery?: GalleryAsset[];
  description?: string;
  client?: string;
  services?: string[];
  design_rationale?: string;
  status: string;
  sort_order: number;
  show_on_homepage?: boolean;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: string;
  cover_image?: string;
  author?: string;
  faq?: Array<{ question: string; answer: string }>;
  tags?: string[];
  ai_summary?: string;
  status: string;
  show_on_homepage?: boolean;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getPublishedWorks(limit?: number): Promise<Work[]> {
  const supabase = getReadOnlyClient();
  let query = supabase
    .from("works")
    .select(WORK_FIELDS)
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as Work[]) || [];
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const supabase = getReadOnlyClient();
  const { data } = await supabase
    .from("works")
    .select(`${WORK_FIELDS},content,client,services,design_rationale,hero_image,gallery,seo_title,seo_description,og_image,published_at`)
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data ? { ...data, content: data.content ? cleanContent(data.content) : data.content } as Work : null;
}

export async function getHomepageWorks(): Promise<Work[]> {
  const supabase = getReadOnlyClient();
  const { data } = await supabase
    .from("works")
    .select(WORK_FIELDS)
    .eq("status", "published")
    .eq("show_on_homepage", true)
    .order("sort_order", { ascending: true })
    .limit(4);
  return (data as Work[]) || [];
}

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = getReadOnlyClient();
  let query = supabase
    .from("blog_posts")
    .select(POST_FIELDS)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as BlogPost[]) || [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getReadOnlyClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(`${POST_FIELDS},content,faq,tags,ai_summary,seo_title,seo_description,og_image`)
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data ? { ...data, content: data.content ? cleanContent(data.content) : data.content } as BlogPost : null;
}

export interface StorageImage {
  name: string;
  url: string;
}

export async function getWorkStorageImages(slug: string): Promise<StorageImage[]> {
  const supabase = getReadOnlyClient();
  const { data } = await supabase.storage
    .from("published-assets")
    .list(`works/${slug}/original`, {
      sortBy: { column: "name", order: "asc" },
      limit: 200,
    });
  if (!data) return [];
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return data
    .filter((f) => f.name && /\.(jpe?g|png|webp|gif|svg)$/i.test(f.name))
    .map((f) => ({
      name: f.name,
      url: `${baseUrl}/storage/v1/object/public/published-assets/works/${slug}/original/${f.name}`,
    }));
}

export async function getHomepagePosts(): Promise<BlogPost[]> {
  const supabase = getReadOnlyClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(POST_FIELDS)
    .eq("status", "published")
    .eq("show_on_homepage", true)
    .order("published_at", { ascending: false })
    .limit(3);
  return (data as BlogPost[]) || [];
}
