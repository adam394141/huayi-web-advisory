import test from "node:test";
import assert from "node:assert/strict";
import {
  contactInquirySchema,
  isHumanTiming,
  isSameOrigin,
} from "../src/lib/contact-inquiry";

const validInquiry = {
  name: "王小明",
  email: "hello@example.com",
  company: "範例品牌",
  type: "品牌策略",
  message: "想了解品牌策略顧問的合作方式。",
  consent: true,
  website: "",
  startedAt: 1_000,
};

test("聯絡資料只接受白名單類型與必要同意", () => {
  assert.equal(contactInquirySchema.safeParse(validInquiry).success, true);
  assert.equal(contactInquirySchema.safeParse({ ...validInquiry, type: "未定義服務" }).success, false);
  assert.equal(contactInquirySchema.safeParse({ ...validInquiry, consent: false }).success, false);
  assert.equal(contactInquirySchema.safeParse({ ...validInquiry, website: "spam" }).success, false);
});

test("拒絕太快或過期的表單", () => {
  assert.equal(isHumanTiming(8_000, 10_000), true);
  assert.equal(isHumanTiming(9_500, 10_000), false);
  assert.equal(isHumanTiming(1_000, 7_202_000), false);
});

test("只接受同網域送出", () => {
  assert.equal(isSameOrigin("https://huayi.tw/api/contact", "https://huayi.tw"), true);
  assert.equal(isSameOrigin("https://huayi.tw/api/contact", "https://example.com"), false);
  assert.equal(isSameOrigin("https://huayi.tw/api/contact", "not-a-url"), false);
});
