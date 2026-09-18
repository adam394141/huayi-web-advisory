import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);

export const articleSectionSchema = z.object({
  heading_level: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(2),
  heading: text(180),
  paragraphs: z.array(text(4_000)).min(1).max(12),
  bullet_points: z.array(text(1_000)).max(20).default([]),
  numbered_steps: z.array(text(1_000)).max(20).default([]),
});

export const contentAiOutputSchema = z.object({
  fact_ledger: z.array(z.object({
    claim: text(500),
    source_quote: text(1_000),
    status: z.enum(["supported", "needs_review"]),
  })).max(80),
  article: z.object({
    title: text(180),
    excerpt: text(500),
    sections: z.array(articleSectionSchema).min(1).max(30),
  }),
  seo: z.object({
    title: text(70),
    description: text(180),
    focus_keyword: text(80),
    related_keywords: z.array(text(80)).max(8),
  }),
  aeo: z.object({
    direct_answer: text(500),
    faq: z.array(z.object({
      question: text(180),
      answer: text(600),
    })).max(8),
  }),
  geo: z.object({
    entities: z.array(z.object({
      name: text(120),
      type: text(80),
      source_quote: text(500),
    })).max(30),
    source_gaps: z.array(text(300)).max(20),
  }),
  tags: z.array(text(40)).max(8),
  internal_links: z.array(z.object({
    path: text(240),
    anchor_text: text(120),
    reason: text(300),
  })).max(8),
  image_alt_suggestions: z.array(z.object({
    image_url: text(2_048),
    alt: text(180),
  })).max(30),
  human_review_notes: z.array(text(500)).max(30),
  blocking_issues: z.array(text(500)).max(30),
});

// Gemini 結構化輸出只支援部分 JSON Schema，不接受 Zod 產生的 maxLength。
// 對外請求使用相同結構但不傳字串長度限制；收到結果後仍以
// contentAiOutputSchema 做完整長度與安全驗證。
const googleText = z.string();
export const googleContentAiOutputSchema = z.object({
  fact_ledger: z.array(z.object({
    claim: googleText,
    source_quote: googleText,
    status: z.enum(["supported", "needs_review"]),
  })).max(80),
  article: z.object({
    title: googleText,
    excerpt: googleText,
    sections: z.array(z.object({
      heading_level: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(2),
      heading: googleText,
      paragraphs: z.array(googleText).min(1).max(12),
      bullet_points: z.array(googleText).max(20).default([]),
      numbered_steps: z.array(googleText).max(20).default([]),
    })).min(1).max(30),
  }),
  seo: z.object({
    title: googleText,
    description: googleText,
    focus_keyword: googleText,
    related_keywords: z.array(googleText).max(8),
  }),
  aeo: z.object({
    direct_answer: googleText,
    faq: z.array(z.object({ question: googleText, answer: googleText })).max(8),
  }),
  geo: z.object({
    entities: z.array(z.object({ name: googleText, type: googleText, source_quote: googleText })).max(30),
    source_gaps: z.array(googleText).max(20),
  }),
  tags: z.array(googleText).max(8),
  internal_links: z.array(z.object({ path: googleText, anchor_text: googleText, reason: googleText })).max(8),
  image_alt_suggestions: z.array(z.object({ image_url: googleText, alt: googleText })).max(30),
  human_review_notes: z.array(googleText).max(30),
  blocking_issues: z.array(googleText).max(30),
});

export type ContentAiOutput = z.infer<typeof contentAiOutputSchema>;
export type ArticleSection = z.infer<typeof articleSectionSchema>;

export type StoredAiResult = ContentAiOutput & {
  article: ContentAiOutput["article"] & { content_html: string };
  deterministic_blockers: string[];
};
