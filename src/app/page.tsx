import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeader } from "@/components/section-header";
import { HeroMotion } from "@/components/hero-motion";
import { ChallengesMotion } from "@/components/challenges-motion";
import { ServicesMotion } from "@/components/services-motion";
import { AiSectionMotion } from "@/components/ai-section-motion";
import { WorksMotion } from "@/components/works-motion";
import { getHomepageWorks, getHomepagePosts } from "@/lib/content";

export const revalidate = 60;

const PAIN_POINTS = [
  {
    title: "品牌定位模糊",
    desc: "產品有實力，但市場不認識你。缺乏清晰定位，導致行銷資源分散、客戶記不住。",
  },
  {
    title: "數位轉型無方向",
    desc: "知道要做 AI，卻不知從何下手。工具越買越多，效率反而沒提升。",
  },
  {
    title: "行銷預算沒效率",
    desc: "廣告持續投放，但轉換率低迷。缺乏策略導致每一筆預算都在試錯。",
  },
  {
    title: "二代接班缺策略",
    desc: "接下家業卻難以突破框架。品牌需要重新定位，但不知如何在傳承中創新。",
  },
];

const SERVICES_DATA = [
  {
    num: "01",
    iconName: "Compass",
    title: "品牌策略",
    desc: "從市場研究到品牌定位，建立清晰的品牌差異化資產。我們運用 SWOT、STP、4P、品牌金字塔等框架，讓品牌不只有方向，更有可執行的路徑。",
    href: "/services",
    deliverables: ["品牌定位報告", "市場競品分析", "差異化策略方案", "品牌金字塔建構", "目標客群定義"],
  },
  {
    num: "02",
    iconName: "Bot",
    title: "企業 AI 導入",
    desc: "不賣工具，而是協助企業找到 AI 真正能創造價值的切入點。從導入評估、企業內訓到系統建置，以 MVP 思維快速驗證，開發週期 2-3 天。",
    href: "/services",
    deliverables: ["AI 導入評估報告", "企業內訓課程", "MVP 系統快速開發", "流程自動化方案", "AI 內容產出系統"],
  },
  {
    num: "03",
    iconName: "TrendingUp",
    title: "品牌行銷與商業成長",
    desc: "整合 Facebook 與 Google 廣告投放、社群經營與內容行銷，讓每一筆預算發揮最大效益。不只做曝光，更聚焦轉換與實際商業成長。",
    href: "/services",
    deliverables: ["Facebook / Google 廣告投放", "社群經營策略", "內容行銷規劃", "數據分析與優化", "行銷漏斗建置"],
  },
  {
    num: "04",
    iconName: "Palette",
    title: "品牌體驗與設計",
    desc: "從品牌識別到包裝設計，打造一致且有記憶點的品牌體驗。不只是好看，更要能在市場中被辨識、被記住。",
    href: "/services",
    deliverables: ["CIS 品牌識別系統", "包裝設計", "活動主視覺設計", "品牌周邊設計", "品牌應用規範"],
  },
];

const METHOD_STEPS = [
  { num: "01", title: "診斷", desc: "深入理解企業痛點與市場位置" },
  { num: "02", title: "策略", desc: "提出 2-3 個可行方案與優先順序" },
  { num: "03", title: "執行", desc: "具體工具、技術、時程與成本規劃" },
];

const AI_CAPABILITIES = [
  { title: "智慧內容產出", desc: "AI 輔助品牌文案、素材生成與多語系擴展" },
  { title: "數據分析決策", desc: "市場數據解讀、競品監測與策略調整建議" },
  { title: "流程自動化", desc: "重複性工作自動化，讓團隊聚焦高價值任務" },
];

const TEAM = [
  { name: "Adam", title: "品牌顧問" },
  { name: "Rosie", title: "品牌顧問" },
];

export default async function HomePage() {
  const [works, posts] = await Promise.all([
    getHomepageWorks(),
    getHomepagePosts(),
  ]);

  return (
    <>
      {/* 1. Hero — 遮罩揭露 + AI 節點背景 */}
      <HeroMotion />

      <div className="h-16 md:h-24" />

      {/* 2. 企業挑戰 — 桌面交錯上移，手機垂直 reveal */}
      <Section>
        <ChallengesMotion items={PAIN_POINTS} />
      </Section>

      {/* 3. 四大服務 — 桌面 sticky 切換，手機卡片 */}
      <Section className="bg-[var(--color-surface)]">
        <ServicesMotion services={SERVICES_DATA} />
      </Section>

      {/* 4. 顧問方法 — 統一 reveal + stagger + 黃線 */}
      <Section>
        <SectionHeader
          label="METHODOLOGY"
          title="顧問方法"
          description="我們不做套裝方案。每一次合作都從理解企業痛點開始，找出真正需要解決的問題，再設計最適合的策略與執行路徑。"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {METHOD_STEPS.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.1}>
              <div className="relative rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 p-8">
                <span className="text-[2.4rem] font-light text-[var(--color-faint)]/40">
                  {s.num}
                </span>
                <h3 className="mt-3 font-serif text-[1.2rem] font-semibold text-[var(--color-fg)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-body)]">
                  {s.desc}
                </p>
                {i < METHOD_STEPS.length - 1 && (
                  <span className="absolute right-[-18px] top-1/2 hidden -translate-y-1/2 text-[var(--color-faint)] md:block">
                    →
                  </span>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* 5. AI 深色區塊 — 網格 + 節點脈衝 + 流程路徑 */}
      <AiSectionMotion items={AI_CAPABILITIES} />

      {/* 6. 精選作品 — 遮罩展開 + 輕視差 */}
      <Section>
        <div className="flex items-end justify-between">
          <SectionHeader label="SELECTED WORKS" title="精選作品" />
          <Link
            href="/works"
            className="hidden text-[12px] tracking-wider text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)] md:block"
          >
            查看所有作品 →
          </Link>
        </div>
        <div className="mt-10">
          <WorksMotion works={works} />
        </div>
        <p className="mt-8 text-center md:hidden">
          <Link
            href="/works"
            className="text-[13px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
          >
            查看所有作品 →
          </Link>
        </p>
      </Section>

      {/* 7. 最新觀點 — 統一 reveal */}
      <Section className="bg-[var(--color-surface)]">
        <div className="flex items-end justify-between">
          <SectionHeader label="INSIGHTS" title="最新觀點" />
          <Link
            href="/blog"
            className="hidden text-[12px] tracking-wider text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)] md:block"
          >
            查看全部文章 →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.08}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface-alt)]">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="aspect-[3/2] w-full" />
                  )}
                </div>
                <p className="mt-4 text-[11px] text-[var(--color-subtle)]">
                  {post.category}
                  {post.published_at &&
                    ` · ${new Date(post.published_at).toLocaleDateString("zh-TW")}`}
                </p>
                <h3 className="mt-2 text-[15px] font-medium leading-snug text-[var(--color-fg)]">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-body)]">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <p className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="text-[13px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
          >
            查看全部文章 →
          </Link>
        </p>
      </Section>

      {/* 7. 團隊 — 統一 reveal */}
      <Section>
        <SectionHeader label="TEAM" title="華翼團隊" />
        <div className="mt-10 grid max-w-[640px] gap-8 md:grid-cols-2">
          {TEAM.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <div className="flex aspect-[3/4] items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-surface)]">
                <span className="text-[13px] text-[var(--color-subtle)]">
                  Placeholder — 待替換真實照片
                </span>
              </div>
              <h3 className="mt-4 text-[16px] font-medium text-[var(--color-fg)]">
                {member.name}
              </h3>
              <p className="mt-1 text-[13px] text-[var(--color-body)]">
                {member.title}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* 7. CTA — 統一 reveal */}
      <Section className="text-center">
        <ScrollReveal>
          <h2 className="mx-auto font-serif text-[1.4rem] text-[var(--color-fg)] md:text-[1.8rem]">
            讓好品牌，被市場看見真正的價值
          </h2>
          <p className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[13px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
            >
              開始合作
            </Link>
          </p>
        </ScrollReveal>
      </Section>
    </>
  );
}
