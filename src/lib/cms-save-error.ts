type DatabaseError = {
  code?: string | null;
  message?: string | null;
};

export type CmsSaveError = {
  message: string;
  status: number;
  kind: "conflict" | "duplicate" | "locked" | "timeout" | "unknown";
};

/** 將資料庫錯誤轉成不洩漏內部結構、但足以讓管理者處理的訊息。 */
export function mapCmsSaveError(error: DatabaseError): CmsSaveError {
  if (error.code === "PT409" || error.code === "40001") {
    return { message: "這筆內容已被更新，請重新載入後再修改。", status: 409, kind: "conflict" };
  }
  if (error.code === "23505") {
    return { message: "網址代稱已被其他內容使用。", status: 409, kind: "duplicate" };
  }
  if (error.code === "55P03") {
    return { message: "這筆內容正被另一個儲存操作占用，請稍候再試。", status: 423, kind: "locked" };
  }
  if (error.code === "57014" || /abort|timeout|timed out/i.test(error.message || "")) {
    return { message: "儲存逾時，未完成的內容仍保留在畫面上，請稍候再試。", status: 504, kind: "timeout" };
  }
  return { message: "儲存失敗，未變更任何資料。", status: 503, kind: "unknown" };
}
