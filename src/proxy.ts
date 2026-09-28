import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 舊站作品 id → 新站 slug
const WORK_ID_MAP: Record<string, string> = {
  "26": "fiti-program",
  "29": "gaoda-farm-line",
  "28": "fangyun-chilu-home",
  "27": "taichung-startup-event",
  "25": "bazhi-yoga-line",
  "24": "clawson-line",
  "23": "chengshi-nuts-marketing",
  "22": "other-items",
  "21": "glass-cup",
  "20": "gift-box",
  "19": "packaging-box",
  "18": "paper-bag",
};

// 舊站文章 id → 新站 slug
const ARTICLE_ID_MAP: Record<string, string> = {
  "24": "ai-agent-not-human-org",
  "23": "financial-decision-vs-life",
  "22": "claude-design",
  "21": "ai-memory-migration-gemini",
};

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 舊站作品詳情：/product-info.asp?id=XX → /works/slug
  if (pathname === "/product-info.asp") {
    const id = searchParams.get("id");
    const slug = id ? WORK_ID_MAP[id] : null;
    const destination = slug ? `/works/${slug}` : "/works";
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }

  // 舊站文章詳情：/article-info.asp?id=XX → /blog/slug
  if (pathname === "/article-info.asp") {
    const id = searchParams.get("id");
    const slug = id ? ARTICLE_ID_MAP[id] : null;
    const destination = slug ? `/blog/${slug}` : "/blog";
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product-info.asp", "/article-info.asp"],
};
