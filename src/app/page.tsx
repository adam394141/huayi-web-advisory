import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeader } from "@/components/section-header";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { getPublishedWorks, getHomepagePosts } from "@/lib/content";
import { getImageById } from "@/lib/home-images";
import { LogoMotion } from "@/components/logo-motion";
import { WorkCover } from "@/components/work-cover";
import { safeJsonLd } from "@/lib/content-safety";
import { getCanonicalSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

const CHALLENGE_TAGS = ["外包換了三家都講不通", "請了行銷半年就走", "請了高階主管也不知道專不專業", "有方向但落不了地", "關鍵人物離開就斷"];

const SERVICES_CARDS = [
  { imageId: "service-strategy", title: "品牌策略", desc: "市場研究到品牌定位，建立差異化資產", href: "/services/brand-strategy" },
  { imageId: "service-ai", title: "AI 導入", desc: "找到 AI 創造價值的切入點，快速驗證", href: "/services/ai" },
  { imageId: "service-marketing", title: "行銷成長", desc: "整合廣告與內容，聚焦轉換與成長", href: "/services/marketing" },
  { imageId: "service-design", title: "品牌體驗", desc: "品牌識別到包裝設計，打造一致體驗", href: "/services/design" },
];

export default async function HomePage() {
  const [works, posts] = await Promise.all([
    getPublishedWorks(8),
    getHomepagePosts(),
  ]);

  const heroImg = getImageById("hero-main");
  const challengeImg = getImageById("challenges-scene");
  const methodImg = getImageById("method-flow");
  const aiImg = getImageById("ai-main");
  const ctaImg = getImageById("cta-bg");
  const teamAdam = getImageById("team-adam");
  const teamRosie = getImageById("team-rosie");

  const site = getCanonicalSiteUrl();

  const homeLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
        "@id": `${site}/#organization`,
        name: "華翼品牌策略",
        alternateName: "HUAYI Brand Strategy",
        url: site,
        logo: `${site}/brand/huayi-logo.svg`,
        description: "華翼以駐點顧問方式，協助台灣中小企業建立品牌與行銷團隊。診斷現場、建立團隊、駐點陪跑、獨立運作——讓現場能獨立運作。",
        telephone: "+886-7-313-1445",
        address: {
          "@type": "PostalAddress",
          streetAddress: "中正三路25號13樓",
          addressLocality: "新興區",
          addressRegion: "高雄市",
          postalCode: "800",
          addressCountry: "TW",
        },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "12:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:00", closes: "18:00" },
        ],
        areaServed: { "@type": "Country", name: "TW" },
        knowsLanguage: "zh-Hant-TW",
        sameAs: ["https://lin.ee/6r57uKZ"],
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: "華翼品牌策略",
        publisher: { "@id": `${site}/#organization` },
        inLanguage: "zh-Hant-TW",
      },
      {
        "@type": "WebPage",
        "@id": `${site}/#webpage`,
        url: site,
        name: "華翼品牌策略 HUAYI｜品牌顧問 × AI 導入",
        isPartOf: { "@id": `${site}/#website` },
        about: { "@id": `${site}/#organization` },
      },
      {
        "@type": "SiteNavigationElement",
        name: ["關於華翼", "服務項目", "設計作品", "觀點", "聯絡我們"],
        url: [`${site}/about`, `${site}/services`, `${site}/works`, `${site}/blog`, `${site}/contact`],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "行銷到底該外包還是自己養團隊？", acceptedAnswer: { "@type": "Answer", text: "沒有標準答案。如果你的品牌需要長期經營、內容需要深入了解產業，建議自建團隊。外包適合短期專案或技術門檻高的工作（如廣告投放）。華翼可以幫你診斷，告訴你現在最適合哪種配置。" } },
          { "@type": "Question", name: "中小企業的行銷團隊應該怎麼配置？", acceptedAnswer: { "@type": "Answer", text: "依企業規模，通常從 1-3 人開始：一位企劃／小編負責內容，一位設計師負責視覺，搭配 AI 工具提升效率。華翼會依你的需求逐步建議，不會一次要你請五個人。" } },
          { "@type": "Question", name: "請了行銷人員但不知道他專不專業，怎麼辦？", acceptedAnswer: { "@type": "Answer", text: "華翼的駐點顧問會協助你建立明確的職能標準與工作流程，讓你能判斷團隊的產出品質，而不是只看他忙不忙。" } },
          { "@type": "Question", name: "企業導入 AI 要從哪裡開始？", acceptedAnswer: { "@type": "Answer", text: "從痛點最明顯的環節開始。客服回覆太慢？內容產出太慢？華翼會先診斷，找到 AI 真正能省時間的切入點，不賣工具，而是教你的團隊會用。" } },
          { "@type": "Question", name: "華翼跟一般行銷公司有什麼不同？", acceptedAnswer: { "@type": "Answer", text: "一般行銷公司替你做事，華翼幫你建團隊。我們以駐點顧問方式進入企業，把流程、角色、工具建立好，讓你的團隊能獨立運作後撤離。建好就走，不綁定、不依賴。" } },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeLd) }}
      />
      {/* 1. Hero — 大型圖片 + 極簡文案 */}
      <LogoMotion />
      <section className="home-hero px-[var(--space-page-x)] pt-8 md:pt-12">
        <div className="mx-auto max-w-[1280px]">
          <ScrollReveal className="hero-entrance">
            <ImagePlaceholder
              src={heroImg?.file}
              alt={heroImg?.alt ?? ""}
              aspect="21/9"
              rounded="var(--radius-module)"
              priority
              className="hero-image"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="hero-entrance">
            <h1 className="mt-7 font-serif text-[2rem] font-semibold leading-[1.4] text-[var(--color-fg)] md:text-[3rem] lg:text-[3.6rem]">
              品牌決定方向，AI 決定速度。
            </h1>
            <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[var(--color-body)]">
              駐點顧問，建立團隊，直到可以獨立運作
            </p>
            <p className="mt-6">
              <Link
                href="/contact"
                className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[15px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
              >
                開始合作
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-16 md:h-24" />

      {/* 2. Challenges — 橫圖 + 四短標籤 */}
      <Section>
        <SectionHeader label="CHALLENGES" title="企業的真實挑戰" />
        <div className="mt-10">
          <ScrollReveal>
            <ImagePlaceholder
              src={challengeImg?.file}
              alt={challengeImg?.alt ?? ""}
              aspect="21/9"
              rounded="var(--radius-module)"
            />
          </ScrollReveal>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
            {CHALLENGE_TAGS.map((tag, i) => (
              <ScrollReveal key={tag} delay={i * 0.06}>
                <span className="inline-block rounded-full border border-[var(--color-faint)]/50 px-5 py-2 text-[15px] tracking-wider text-[var(--color-body)]">
                  {tag}
                </span>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.3}>
            <div className="mt-8 mx-auto max-w-[520px] space-y-4 text-center text-[15px] leading-relaxed text-[var(--color-body)]">
              <p>外包團隊有磨合期、溝通問題，甚至擺爛風險。</p>
              <p>建立自己的團隊，溝通成本更低、更好掌控。</p>
              <p>你的企業該繼續外包，還是建立自己的團隊？讓華翼來診斷。</p>
              <p>如果需要建團隊，我們以駐點顧問方式，陪你從零開始。</p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* 3. Services — 2×2 大圖片卡 */}
      <Section className="bg-[var(--color-surface)]">
        <SectionHeader label="SERVICES" title="四大服務" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SERVICES_CARDS.map((svc, i) => {
            const img = getImageById(svc.imageId);
            const isDesign = svc.imageId === "service-design";
            return (
              <ScrollReveal key={svc.imageId} delay={i * 0.08}>
                <Link href={svc.href} className="group block">
                  <ImagePlaceholder
                    src={img?.file}
                    alt={img?.alt ?? svc.title}
                    aspect="4/3"
                    rounded="var(--radius-card)"
                    contain={isDesign}
                    className={isDesign ? "bg-[var(--color-warm-white)]" : ""}
                  />
                  <h3 className="mt-4 font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">
                    {svc.title}
                  </h3>
                  <p className="mt-1 text-[15px] text-[var(--color-body)]">
                    {svc.desc}
                  </p>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      {/* 4. Method — 流程圖 + 三標籤 */}
      <Section>
        <SectionHeader label="METHODOLOGY" title="顧問方法" />
        <div className="mt-10">
          <ScrollReveal>
            <ImagePlaceholder
              src={methodImg?.file}
              alt={methodImg?.alt ?? ""}
              aspect="21/9"
              rounded="var(--radius-module)"
            />
          </ScrollReveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { title: "診斷", desc: "找出真正要解決的問題，區分該外包、該內建、還是用 AI 取代" },
              { title: "策略", desc: "設計可執行的方案，包含團隊編制、流程規劃與優先順序" },
              { title: "執行", desc: "進場建置，帶著團隊實作與修正，直到能獨立運作" },
            ].map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[2rem] font-light text-[var(--color-faint)]/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-[1.2rem] font-semibold text-[var(--color-fg)] md:text-[1.4rem]">
                      {step.title}
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-body)]">
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. AI — 深色區塊 + 單圖 */}
      <Section dark>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <ScrollReveal>
            <ImagePlaceholder
              src={aiImg?.file}
              alt={aiImg?.alt ?? ""}
              aspect="16/9"
              rounded="var(--radius-card)"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-[12px] tracking-[0.3em] text-[var(--color-gold)]">
              AI INTEGRATION
            </p>
            <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-ai-text)] md:text-[2rem]">
              AI 是建置的加速器
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-ai-muted)]">
              在團隊建置過程中導入 AI 工具，讓新團隊從第一天就能高效運作
            </p>
            <p className="mt-6">
              <Link
                href="/services"
                className="inline-block rounded-[var(--radius-button)] border border-[var(--color-gold)]/40 px-6 py-2.5 text-[12px] tracking-wider text-[var(--color-ai-text)] transition-colors hover:bg-[var(--color-gold)]/10"
              >
                了解 AI 導入
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </Section>

      {/* 6. Works — 等高網格，保留完整設計圖 */}
      <Section>
        <div className="flex items-end justify-between">
          <SectionHeader label="DESIGN WORKS" title="設計作品" />
          <Link
            href="/works"
            className="hidden text-[12px] tracking-wider text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)] md:block"
          >
            查看所有設計作品 →
          </Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work, i) => {
            return (
              <ScrollReveal
                key={work.id}
                delay={i * 0.06}
                className="h-full"
              >
                <Link href={`/works/${work.slug}`} className="group relative flex h-full flex-col">
                  <WorkCover src={work.cover_image} title={work.title} />
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[12px] tracking-wider text-[var(--color-subtle)]">
                      {work.category}
                    </span>
                  </div>
                  <h3 className="mt-1 min-h-12 line-clamp-2 text-[16px] leading-6 font-medium text-[var(--color-fg)]">
                    {work.title}
                  </h3>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/works"
            className="text-[15px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
          >
            查看所有設計作品 →
          </Link>
        </p>
      </Section>

      {/* 7. Insights — 封面 + 分類 + 標題 */}
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
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="aspect-[3/2] w-full" />
                  )}
                </div>
                <p className="mt-4 text-[12px] text-[var(--color-subtle)]">
                  {post.category}
                </p>
                <h3 className="mt-1 text-[15px] font-medium leading-snug text-[var(--color-fg)]">
                  {post.title}
                </h3>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <p className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="text-[15px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
          >
            查看全部文章 →
          </Link>
        </p>
      </Section>

      {/* 8. Team — 大型雙人 */}
      <Section>
        <SectionHeader label="TEAM" title="華翼團隊" />
        <div className="mt-10 grid max-w-[640px] gap-8 md:grid-cols-2">
          {[
            { name: "Adam", img: teamAdam, subtitle: "品牌顧問及 AI 講師", href: "/adam", objectPosition: undefined },
            { name: "Rosie", img: teamRosie, subtitle: "品牌顧問", href: "/rosie", objectPosition: "top" as const },
          ].map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <Link href={member.href}>
                <ImagePlaceholder
                  src={member.img?.file}
                  alt={member.img?.alt ?? `${member.name} — 品牌顧問`}
                  aspect="3/4"
                  rounded="var(--radius-card)"
                  objectPosition={member.objectPosition}
                />
                <h3 className="mt-4 text-[16px] font-medium text-[var(--color-fg)]">
                  {member.name}
                </h3>
                <p className="mt-1 text-[15px] text-[var(--color-body)]">
                  {member.subtitle}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* 9. FAQ — 常見問題 */}
      <Section>
        <SectionHeader label="FAQ" title="常見問題" />
        <div className="mt-10 mx-auto max-w-[800px] space-y-6">
          {[
            { q: "行銷到底該外包還是自己養團隊？", a: "沒有標準答案。如果你的品牌需要長期經營、內容需要深入了解產業，建議自建團隊。外包適合短期專案或技術門檻高的工作（如廣告投放）。華翼可以幫你診斷，告訴你現在最適合哪種配置。" },
            { q: "中小企業的行銷團隊應該怎麼配置？", a: "依企業規模，通常從 1-3 人開始：一位企劃／小編負責內容，一位設計師負責視覺，搭配 AI 工具提升效率。華翼會依你的需求逐步建議，不會一次要你請五個人。" },
            { q: "請了行銷人員但不知道他專不專業，怎麼辦？", a: "這是很多老闆的痛點。華翼的駐點顧問會協助你建立明確的職能標準與工作流程，讓你能判斷團隊的產出品質，而不是只看他忙不忙。" },
            { q: "企業導入 AI 要從哪裡開始？", a: "從痛點最明顯的環節開始。客服回覆太慢？內容產出太慢？華翼會先診斷，找到 AI 真正能省時間的切入點，不賣工具，而是教你的團隊會用。" },
            { q: "華翼跟一般行銷公司有什麼不同？", a: "一般行銷公司替你做事，華翼幫你建團隊。我們以駐點顧問方式進入企業，把流程、角色、工具建立好，讓你的團隊能獨立運作後撤離。建好就走，不綁定、不依賴。" },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <details className="group rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 px-6 py-5">
                <summary className="flex cursor-pointer items-center justify-between text-[16px] font-medium text-[var(--color-fg)]">
                  {item.q}
                  <span className="ml-4 shrink-0 text-[var(--color-subtle)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-body)]">
                  {item.a}
                </p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* 10. CTA — 背景圖 + 邀請文字 */}
      <section className="relative px-[var(--space-page-x)] py-[var(--space-section-y)]">
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 0 }}>
          <ImagePlaceholder
            src={ctaImg?.file}
            alt={ctaImg?.alt ?? ""}
            aspect=""
            rounded="0"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-[var(--color-warm-white)]/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1280px] text-center">
          <ScrollReveal>
            <h2 className="mx-auto max-w-[480px] font-serif text-[1.4rem] leading-relaxed text-[var(--color-fg)] md:text-[1.8rem]">
              先花 30 分鐘做企業體檢，我們直接告訴你現在該外包還是該建團隊
            </h2>
            <p className="mt-8">
              <Link
                href="/contact"
                className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[15px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
              >
                聯絡我們
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
