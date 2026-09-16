# 華翼 CMS 單一圖文編輯器實作計畫

## 1. 編輯核心

- 安裝 Tiptap React、StarterKit、Link 與 TableKit。
- 建立單一 `RichTextEditor` Client Component，關閉伺服器立即渲染。
- 限制標題層級為 H2–H4，加入文字、清單、引用、連結、表格及復原工具。

## 2. 圖片節點

- 建立可解析既有 `figure/img/figcaption` 的 CMS Image node。
- 保留圖片 URL、alt、caption、寬高、原始尺寸與壓縮資訊。
- 將現有 Supabase 圖片上傳 API 接進編輯器工具列。
- 在開啟上傳器時保存游標位置，上傳完成後插入該位置。
- 圖片選取時提供中繼資料修改、替換及刪除。

## 3. 狀態同步

- 編輯器更新時輸出 HTML 至既有表單狀態。
- AI 套用與版本還原時，以不觸發更新事件的方式載入外部 HTML。
- 移除舊多區塊卡片、獨立圖片上傳區與相關 DOM 解析狀態。

## 4. 驗證與交付

- 驗證舊 HTML 載入、AI 外部更新、游標插圖、圖片中繼資料與儲存往返。
- 執行既有測試、lint、TypeScript 與正式建置。
- 部署原分支 Preview，確認後台新編輯器；不合併 main。
