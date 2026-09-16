# CMS 媒體庫實作計畫

1. 建立只讀媒體索引 SQL：限定 Adam、AAL2、本人 CMS optimized 路徑，回傳引用狀態與分頁總數。
2. 建立媒體查詢參數白名單與單元測試。
3. 建立 `/api/cms/media` 管理員只讀 Route Handler，將 Storage path 轉為公開網站版 URL。
4. 建立媒體庫 Client Component：搜尋、篩選、縮圖、尺寸、容量、引用狀態、複製網址及分頁。
5. 將媒體庫接入現有 `/admin` 導覽，不改作品／觀點編輯流程。
6. 執行測試、lint、webpack production build；提交並部署 Preview。
7. 在 Preview 驗證登入與 API；SQL 未安裝前需安全降級，不影響其他後台功能。
