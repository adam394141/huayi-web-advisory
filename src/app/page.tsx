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

export const revalidate = 60;

const CHALLENGE_TAGS = ["定位不清", "團隊斷層", "AI 難落地", "行銷失焦"];

const SERVICES_CARDS = [
  { imageId: "service-strategy", title: "品牌策略", desc: "市場研究到品牌定位，建立差異化資產" },
  { imageId: "service-ai", title: "AI 導入", desc: "找到 AI 創造價值的切入點，快速驗證" },
  { imageId: "service-marketing", title: "行銷成長", desc: "整合廣告與內容，聚焦轉換與成長" },
  { imageId: "service-design", title: "品牌體驗", desc: "品牌識別到包裝設計，打造一致體驗" },
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

  return (
    <>
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
            <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-[var(--color-body)]">
              為台灣中小企業與二代接班人，打造差異化品牌資產
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
                <Link href="/services" className="group block">
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
          <div className="mt-8 flex items-center justify-center gap-6 md:gap-10">
            {["診斷", "策略", "執行"].map((step, i) => (
              <ScrollReveal key={step} delay={i * 0.1}>
                <div className="flex items-center gap-4 md:gap-8">
                  <span className="font-serif text-[1.1rem] font-semibold text-[var(--color-fg)] md:text-[1.3rem]">
                    {step}
                  </span>
                  {i < 2 && (
                    <span className="text-[var(--color-faint)]">→</span>
                  )}
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
              AI 是策略的一部分
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-ai-muted)]">
              協助企業找到 AI 真正創造價值的切入點
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
          <SectionHeader label="SELECTED WORKS" title="精選作品" />
          <Link
            href="/works"
            className="hidden text-[12px] tracking-wider text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)] md:block"
          >
            查看所有作品 →
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
            查看所有作品 →
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
            { name: "Adam", img: teamAdam },
            { name: "Rosie", img: teamRosie },
          ].map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <ImagePlaceholder
                src={member.img?.file}
                alt={member.img?.alt ?? `${member.name} — 品牌顧問`}
                aspect="3/4"
                rounded="var(--radius-card)"
              />
              <h3 className="mt-4 text-[16px] font-medium text-[var(--color-fg)]">
                {member.name}
              </h3>
              <p className="mt-1 text-[15px] text-[var(--color-body)]">
                品牌顧問
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* 9. CTA — 背景圖 + 邀請文字 */}
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
              讓好品牌，被市場看見真正的價值
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
