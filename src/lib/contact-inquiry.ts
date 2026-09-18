import { z } from "zod";

export const CONTACT_INQUIRY_TYPES = [
  "品牌策略",
  "AI 導入",
  "行銷",
  "設計",
  "其他",
] as const;

export const contactInquirySchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  company: z.string().trim().max(120).default(""),
  type: z.enum(CONTACT_INQUIRY_TYPES),
  message: z.string().trim().min(10).max(5_000),
  consent: z.literal(true),
  website: z.string().max(0),
  startedAt: z.number().int().positive(),
});

export type ContactInquiry = z.infer<typeof contactInquirySchema>;

export function isHumanTiming(startedAt: number, now = Date.now()) {
  const elapsed = now - startedAt;
  return elapsed >= 2_000 && elapsed <= 2 * 60 * 60 * 1_000;
}

export function isSameOrigin(requestUrl: string, origin: string | null) {
  if (!origin) return true;
  try {
    return new URL(requestUrl).host === new URL(origin).host;
  } catch {
    return false;
  }
}
