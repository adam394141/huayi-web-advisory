# CMS 媒體庫選圖實作計畫

1. 建立媒體選取資料型別與檔名轉替代文字的安全 helper，加入單元測試。
2. 建立共用 Media Picker Client Component，沿用 `/api/cms/media`、搜尋、類型篩選、分頁與 WebP 實際尺寸讀取。
3. 封面上傳元件加入「從媒體庫選擇」，選取後同步封面 URL、尺寸與儲存提醒。
4. Tiptap 工具列加入「從媒體庫插圖」，保存開啟視窗時的游標位置，選取後插入圖片與後續段落。
5. 保留既有上傳、替換、替代文字、圖片說明與刪除流程，不加入 Storage 刪除或資料搬移。
6. 執行單元測試、ESLint、TypeScript 與 Webpack production build。
7. 提交至 `fix/advisory-visual-polish`、推送並等待 Vercel Preview；不合併 `main`。
8. 以 Preview 驗證封面選圖、內文游標插圖與媒體數量不增加，回寫 Notion Current State delta。

