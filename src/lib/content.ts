import { getReadOnlyClient } from "./supabase";

// 唯讀資料適配器 — 只提供 SELECT，不含任何 mutation

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
    .select("*")
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
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as Work | null;
}

export async function getHomepageWorks(): Promise<Work[]> {
  const supabase = getReadOnlyClient();
  const { data } = await supabase
    .from("works")
    .select("*")
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
    .select("*")
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
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as BlogPost | null;
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
    .select("*")
    .eq("status", "published")
    .eq("show_on_homepage", true)
    .order("published_at", { ascending: false })
    .limit(3);
  return (data as BlogPost[]) || [];
}
