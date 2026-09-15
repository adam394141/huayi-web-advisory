type AiFailure = {
  code: string;
  message: string;
};

export function toSafeAiFailure(error: unknown): AiFailure {
  const rawMessage = error instanceof Error ? error.message : "";
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? Number((error as { statusCode?: unknown }).statusCode)
      : 0;

  if (statusCode === 403 && /credit card|customer_verification_required/i.test(rawMessage)) {
    return {
      code: "AI_GATEWAY_BILLING_REQUIRED",
      message: "AI 服務尚未完成 Vercel 付款驗證；文章原稿沒有被修改。請由專案管理者完成一次付款方式驗證後再重試。",
    };
  }

  if (statusCode === 402) {
    return {
      code: "AI_GATEWAY_BUDGET_REACHED",
      message: "AI 使用額度已達上限；文章原稿沒有被修改。請由專案管理者檢查 AI 預算設定。",
    };
  }

  if ((statusCode === 401 || statusCode === 403) && /api.?key|permission|unauth|forbidden/i.test(rawMessage)) {
    return {
      code: "AI_PROVIDER_AUTH_FAILED",
      message: "AI 服務驗證失敗；文章原稿沒有被修改。請由專案管理者檢查伺服器端金鑰設定。",
    };
  }

  if (statusCode === 429) {
    return {
      code: "AI_PROVIDER_RATE_LIMITED",
      message: "AI 目前請求較多；文章原稿沒有被修改，請稍後再安全重試。",
    };
  }

  if (statusCode === 400 && /schema|maxLength|structured|invalid argument/i.test(rawMessage)) {
    return {
      code: "AI_PROVIDER_SCHEMA_REJECTED",
      message: "AI 輸出格式暫時不相容；文章原稿沒有被修改。請由專案管理者更新格式後再重試。",
    };
  }

  if (/No object generated|did not match schema|could not parse/i.test(rawMessage)) {
    return {
      code: "AI_OUTPUT_INVALID",
      message: "AI 已回覆但內容格式未通過安全檢查；文章原稿沒有被修改，請安全重試。",
    };
  }

  if (/abort|timeout/i.test(rawMessage)) {
    return {
      code: "AI_TIMEOUT",
      message: "AI 處理逾時；文章原稿沒有被修改，請稍後再安全重試。",
    };
  }

  return {
    code: "AI_PROVIDER_FAILED",
    message: "AI 處理未完成，文章原稿沒有被修改。",
  };
}

export function getSafeAiDiagnostic(error: unknown) {
  const candidate = error as { name?: unknown; statusCode?: unknown; cause?: { name?: unknown; statusCode?: unknown } } | null;
  return {
    name: typeof candidate?.name === "string" ? candidate.name : "unknown",
    statusCode: Number(candidate?.statusCode || candidate?.cause?.statusCode || 0) || null,
    causeName: typeof candidate?.cause?.name === "string" ? candidate.cause.name : null,
  };
}
