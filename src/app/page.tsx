import Link from "next/link";
import Image from "next/image";
import { Compass, Bot, TrendingUp, Palette } from "lucide-react";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getHomepageWorks, getHomepagePosts } from "@/lib/content";

export const revalidate = 60;

const CAPABILITIES = [
  "Brand Strategy",
  "AI Transformation",
  "Growth Marketing",
  "Brand Experience",
];

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

const SERVICES = [
  {
    icon: Compass,
    title: "品牌策略",
    desc: "從市場研究到品牌定位，建立清晰的品牌差異化資產。",
    href: "/services",
  },
  {
    icon: Bot,
    title: "企業 AI 導入",
    desc: "評估 AI 導入機會，從內訓到系統建置，用技術加速企業成長。",
    href: "/services",
  },
  {
    icon: TrendingUp,
    title: "品牌行銷與商業成長",
    desc: "整合廣告投放、社群與內容行銷，讓每一筆預算發揮最大效益。",
    href: "/services",
  },
  {
    icon: Palette,
    title: "品牌體驗與設計",
    desc: "從品牌識別到包裝設計，打造一致且有記憶點的品牌體驗。",
    href: "/services",
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
      {/* Hero */}
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.4em] text-[var(--color-gold-dark)]">
            HUAYI BRAND STRATEGY
          </p>
          <h1 className="mt-6 font-serif text-[2rem] font-semibold leading-[1.5] text-[var(--color-fg)] md:text-[3rem] lg:text-[3.8rem]">
            品牌決定企業方向，
            <br />
            AI 決定企業速度。
          </h1>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[14px] font-medium tracking-wider text-[var(--color-gold-dark)]">
                診斷 × 定位 × 策略 = 企業差異化資產
              </p>
              <p className="mt-5">
                <Link
                  href="/contact"
                  className="border-b border-[var(--color-fg)] pb-1 text-[12px] tracking-[0.12em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-gold-dark)] hover:text-[var(--color-gold-dark)]"
                >
                  合作洽詢 →
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-6 md:gap-10">
              {CAPABILITIES.map((cap) => (
                <span
                  key={cap}
                  className="text-[10px] tracking-[0.2em] text-[var(--color-faint)]"
                >
                  {cap.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* Problem */}
      <Section>
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">
            CHALLENGES
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            企業經營的真實挑戰
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PAIN_POINTS.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <div className="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-8 md:p-10">
                <h3 className="font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-body)]">
                  {p.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section className="bg-[var(--color-surface)]">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">
            SERVICES
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            四大服務
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.08}>
              <div className="flex flex-col rounded-[var(--radius-card)] bg-[var(--color-warm-white)] p-8 md:p-10">
                <s.icon
                  className="h-7 w-7 text-[var(--color-gold-dark)]"
                  strokeWidth={1.5}
                />
                <h3 className="mt-5 font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[var(--color-body)]">
                  {s.desc}
                </p>
                <Link
                  href={s.href}
                  className="mt-6 inline-block text-[12px] tracking-wider text-[var(--color-fg)] transition-colors hover:text-[var(--color-gold-dark)]"
                >
                  了解更多 →
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Method */}
      <Section>
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">
            METHODOLOGY
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            顧問方法
          </h2>
          <p className="mt-4 max-w-[560px] text-[14px] leading-relaxed text-[var(--color-body)]">
            我們不做套裝方案。每一次合作都從理解企業痛點開始，找出真正需要解決的問題，再設計最適合的策略與執行路徑。
          </p>
        </ScrollReveal>
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

      {/* AI Dark Section */}
      <Section dark>
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] text-[var(--color-gold)]">
            AI INTEGRATION
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-ai-text)] md:text-[2.2rem]">
            AI 不只是工具，是策略的一部分
          </h2>
          <p className="mt-4 max-w-[560px] text-[14px] leading-relaxed text-[var(--color-ai-muted)]">
            我們不賣 AI 工具，而是協助企業找到 AI
            真正能創造價值的切入點，從流程優化到內容產出，讓技術成為品牌成長的加速器。
          </p>
        </ScrollReveal>
        <div
          className="mt-12 grid gap-6 md:grid-cols-3"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          {AI_CAPABILITIES.map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 0.1}>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-ai-accent)] bg-[var(--color-ai-surface)] p-8">
                <div className="mb-4 h-px w-8 bg-[var(--color-gold)]" />
                <h3 className="font-serif text-[1rem] font-semibold text-[var(--color-ai-text)]">
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ai-muted)]">
                  {c.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Selected Works */}
      <Section>
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">
            SELECTED WORKS
          </p>
          <div className="mt-3 flex items-end justify-between">
            <h2 className="font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
              精選作品
            </h2>
            <Link
              href="/works"
              className="text-[12px] tracking-wider text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)]"
            >
              查看所有作品 →
            </Link>
          </div>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {works.map((work, i) => (
            <ScrollReveal key={work.id} delay={i * 0.08}>
              <Link href={`/works/${work.slug}`} className="group block">
                <div className="overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface)]">
                  {work.cover_image ? (
                    <Image
                      src={work.cover_image}
                      alt={work.title}
                      width={600}
                      height={750}
                      className="aspect-[4/5] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="aspect-[4/5] w-full" />
                  )}
                </div>
                <h3 className="mt-4 text-[14px] font-medium text-[var(--color-fg)]">
                  {work.title}
                </h3>
                {work.description && (
                  <p className="mt-1 line-clamp-1 text-[12px] text-[var(--color-subtle)]">
                    {work.description}
                  </p>
                )}
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Blog */}
      <Section className="bg-[var(--color-surface)]">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">
            INSIGHTS
          </p>
          <div className="mt-3 flex items-end justify-between">
            <h2 className="font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
              最新觀點
            </h2>
            <Link
              href="/blog"
              className="text-[12px] tracking-wider text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)]"
            >
              查看全部文章 →
            </Link>
          </div>
        </ScrollReveal>
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
      </Section>

      {/* Team */}
      <Section>
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">
            TEAM
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            華翼團隊
          </h2>
        </ScrollReveal>
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

      {/* CTA */}
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
