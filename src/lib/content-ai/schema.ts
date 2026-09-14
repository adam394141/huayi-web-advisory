import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);

export const articleSectionSchema = z.object({
  heading: text(180),
  paragraphs: z.array(text(4_000)).min(1).max(12),
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

export type ContentAiOutput = z.infer<typeof contentAiOutputSchema>;
export type ArticleSection = z.infer<typeof articleSectionSchema>;

export type StoredAiResult = ContentAiOutput & {
  article: ContentAiOutput["article"] & { content_html: string };
  deterministic_blockers: string[];
};
