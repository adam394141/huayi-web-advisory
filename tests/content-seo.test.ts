import test from "node:test";
import assert from "node:assert/strict";
import { getPublishBlockers } from "../src/lib/content-seo";

const complete = { title:"品牌策略",slug:"brand-strategy",excerpt:"華翼協助企業釐清品牌方向。",content:'<h2>方向</h2><p>內容</p><img src="https://huayi.tw/a.jpg" alt="品牌策略示意圖">',cover_image:"/cover.jpg",seo_title:"品牌策略顧問｜華翼品牌策略",seo_description:"華翼協助台灣企業釐清品牌定位與溝通方向，讓策略成為可以執行的商業選擇。" };
test("完整文章可通過 deterministic 發布檢查",()=>assert.deepEqual(getPublishBlockers(complete),[]));
test("缺欄位、錯誤網址、額外 H1 與無替代文字圖片會被阻擋",()=>{const blockers=getPublishBlockers({...complete,slug:"中文",cover_image:"",content:'<h1>重複標題</h1><img src="https://huayi.tw/a.jpg">'});assert.ok(blockers.some((item)=>item.includes("封面")));assert.ok(blockers.some((item)=>item.includes("網址")));assert.ok(blockers.some((item)=>item.includes("替代文字")));assert.ok(blockers.some((item)=>item.includes("H1")));});
