# 第二網站品牌資訊與服務圖片更新

## 範圍

僅第二網站 fix/advisory-visual-polish。第一網站、ADS、講師頁、Supabase 與正式站零寫入。

- Footer／Contact email 與 mailto 更新為 888@huayi.tw。
- 版權名稱與 About 當前品牌名稱更新為「華翼品牌策略」。
- 依 Adam 要求移除首頁可見 AI 合照說明；圖片的 ai_generated 來源 metadata 保留。
- 四大服務分別換成策略桌面、AI 工作流程筆電、行銷內容攝影、品牌包裝體驗。
- CTA 換成黃／米白日光建築寬圖。版型、字體、動畫與原有作品資料未更動。
- 新圖保存 public/home/*-v2.png，既有原圖保留。品牌體驗示意圖維持 contain。

## 內容管理現況（原始碼查核，非後台寫入測試）

| 類型 | 現況 | 注意事項 |
| --- | --- | --- |
| 作品 | 第一網站 /admin/works 管理，共用 works 資料 | 第二網站讀 published 與 sort_order；直接修改可能連動兩站 |
| 觀點 | 第一網站 /admin/blog 管理，共用 blog_posts | 舊後台使用 is_published；第二網站查詢 status=published，欄位一致性尚待核對，不能保證按發布即同步 |
| 團隊 | 第二網站首頁與 about 的程式內容 | 尚無團隊 CMS；需要修改檔案並部署 Preview |

依「第一網站資料不可改」規則，本輪不操作上述後台、不新增獨立資料庫。若要自行管理第二站，先確認隔離方案與是否允許複製資料，再建作品／觀點／團隊的簡單後台；不是全站 CMS。

## 圖片生成

使用內建 imagegen，沒有 API CLI 備援。五張皆為 AI 情境素材，不表示真實客戶、團隊或成果。

共通 prompt：Premium editorial photograph for a Taiwanese brand consultancy; ivory, mustard yellow and charcoal palette, tactile materials, warm daylight, no readable text, logos or people.

- strategy-v2.png：4:3 strategy mapping workspace, ivory cards in three groups, mustard connectors, charcoal notebook, tracing sheet on stone.
- ai-v2.png：4:3 silver laptop with abstract workflow panels/nodes, stone desk, yellow notebook, no robots or neon.
- marketing-v2.png：4:3 content production studio, camera foreground, unbranded yellow product box on ivory sweep, abstract storyboard.
- experience-v2.png：4:3 unbranded coordinated stationery, packaging and canvas tote on ivory plinths, all objects within safe margins.
- cta-v2.png：21:9 ivory architecture with yellow wall, warm sunlight, quiet center for headline, no people.

## 驗證

- ESLint、TypeScript、Next.js webpack build 通過。
- 五張生成原圖均已視覺檢查：色調一致、無客戶 Logo、無虛構人員。
- 本輪未新增或驗證 CMS 寫入；未宣稱 Safari 真機驗收。
