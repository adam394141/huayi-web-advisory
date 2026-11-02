import { z } from "zod";

const BIRTH_DATE_RE = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

export const advisorySchema = z.object({
  name: z.string().trim().min(1).max(40),
  contact: z.string().trim().min(1).max(120),
  city: z.string().trim().max(40).default(""),
  birth_date: z.string().regex(BIRTH_DATE_RE),
  note: z.string().trim().max(600).default(""),
  area: z.string().max(200).default(""),
  duration: z.string().max(200).default(""),
  impact: z.string().max(200).default(""),
  pace: z.string().max(200).default(""),
  screen_flag: z.string().max(10).default(""),
  consent: z.literal(true),
  website: z.string().max(0),
  startedAt: z.number().int().positive(),
});

export type AdvisorySubmission = z.infer<typeof advisorySchema>;

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
