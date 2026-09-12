import type { Metadata } from "next";
import { getPublishedWorks } from "@/lib/content";
import { WorksFilter } from "./works-filter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "作品｜華翼品牌策略",
  description: "華翼品牌策略精選設計作品，涵蓋品牌識別、品牌周邊、行銷專案與 AI 專案。",
};

export default async function WorksPage() {
  const works = await getPublishedWorks();

  return (
    <>
      <section className="px-[var(--space-page-x)] pb-0 pt-20 md:pt-28">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-subtle)]">
            WORKS
          </p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold leading-tight text-[var(--color-fg)] md:text-[3rem]">
            精選案例。
          </h1>
        </div>
      </section>
      <WorksFilter works={works} />
    </>
  );
}
