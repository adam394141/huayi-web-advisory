const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseAiStartRequest(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (typeof body.article_id !== "string" || !UUID.test(body.article_id)) return null;
  if (typeof body.expected_updated_at !== "string" || !Number.isFinite(Date.parse(body.expected_updated_at))) return null;
  if (typeof body.source_material !== "string" || body.source_material.length > 50_000) return null;
  return { articleId: body.article_id, expectedUpdatedAt: body.expected_updated_at, sourceMaterial: body.source_material };
}

export function parseAiApplyRequest(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const allowed = new Set(["title","excerpt","content","seo_title","seo_description","tags","faq","ai_summary"]);
  if (typeof body.expected_updated_at !== "string" || !Number.isFinite(Date.parse(body.expected_updated_at))) return null;
  if (!Array.isArray(body.fields) || !body.fields.length || body.fields.length > allowed.size) return null;
  if (body.fields.some((field) => typeof field !== "string" || !allowed.has(field))) return null;
  if (body.confirm_blockers != null && typeof body.confirm_blockers !== "boolean") return null;
  return { expectedUpdatedAt: body.expected_updated_at, fields: [...new Set(body.fields as string[])], confirmBlockers: body.confirm_blockers === true };
}

export function isUuid(value: string) { return UUID.test(value); }
