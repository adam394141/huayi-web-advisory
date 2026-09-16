# CMS 單一網站圖片儲存設計

## 目標

華翼 Advisory 新官網的作品與觀點後台，在管理員選擇圖片後，只將網站實際需要的一份 WebP 圖片保存到 Supabase Storage，不再另外保存上傳來源原檔。

## 適用範圍

- 第二套 Advisory 新官網的作品與觀點 CMS。
- 封面圖片與圖文編輯器內文圖片。
- 不修改第一網站、`/adam`、`/adam_cpc`、ADS、Cloudflare 或正式網域。

## 圖片處理

- 接受 4 MB 以下的 JPG、PNG、WebP 靜態圖片。
- 封面最大寬度 1200 px；內文最大寬度 1600 px。
- 只縮小、不放大、不裁切，保留原始比例。
- 輸出 WebP，並移除 EXIF 等網站不需要的資訊。
- PNG／含文字設計稿沿用較高品質與 near-lossless 設定，避免文字及設計邊緣明顯失真。
- 後台仍顯示來源尺寸、來源檔案大小及網站版大小，讓管理員了解壓縮結果；這些數值不代表來源檔已保存。

## 儲存規則

- 新上傳只寫入 `published-assets/cms/{userId}/{collection}/{itemId}/optimized/{assetId}.webp`。
- 前台與內容資料只引用此網站版網址。
- 不再建立新的 `original/` 檔案。
- 已存在的 `original/` 與 `optimized/` 檔案維持原狀，本輪不刪除、不搬移、不重新壓縮。
- 媒體庫仍只列出 `optimized/` 圖片，因此介面與既有內容不受影響。

## 失敗與安全

- 最佳化失敗時不寫入 Storage，也不修改頁面。
- Storage 上傳失敗時回傳安全錯誤，不產生資料庫內容引用。
- 保留既有管理員 UUID、Supabase JWT、MFA `aal2`、檔案簽章與 MIME 白名單檢查。
- 不引入 Google Drive API、外部同步、service role 或新的環境變數。

## 後台文字

- 移除「系統保留原圖」等舊說明。
- 明確告知「系統只保存網站版 WebP；需要保存設計原稿或攝影原檔時，請自行保留於公司的素材空間」。
- 上傳完成訊息改為「來源檔大小 → 網站版大小」，避免誤導來源檔仍在 Supabase。

## 驗收

- 新上傳只新增一個 `optimized/*.webp`，沒有新增 `original/*`。
- 封面與內文圖片均能正常顯示、儲存與發布。
- 圖片尺寸、比例、壓縮資訊與 no-crop 規則維持正常。
- 既有媒體庫、作品與觀點內容不回歸。
- 測試、ESLint、TypeScript 與 production build 全數通過。

