"use client";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import StudioCard from "@/components/StudioCard";
import HowItWorks from "@/components/HowItWorks";
import HostGuarantee from "@/components/HostGuarantee";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { Section, SectionHeading } from "@/components/Section";
import { CATEGORY_INFO } from "@/lib/constants";
import { useApi } from "@/lib/useApi";

export default function Home() {
  const { data, loading, error } = useApi("/studios?sort=newest&limit=6");

  return (
    <>
      <HeroSlider />

      <Section>
        <SectionHeading title="Featured studios" subtitle="The newest spaces on StudioSpace, ready to book." />
        {loading ? <GridSkeleton /> : error ? (
          <p className="text-center text-error">{error}</p>
        ) : data?.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
            <div className="mt-10 text-center"><Link href="/studios" className="btn btn-primary">Explore Studios</Link></div>
          </>
        ) : (
          <EmptyState title="No studios listed yet" text="Be the first host on StudioSpace." href="/add-studio" cta="Add New Studio" />
        )}
      </Section>

      <Section className="bg-base-200">
        <SectionHeading title="Browse by studio category" subtitle="Jump straight to the kind of room you need." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_INFO.map((c) => (
            <Link key={c.key} href={`/studios?category=${encodeURIComponent(c.key)}`} className="flex h-full flex-col gap-2 rounded-box bg-base-100 p-6 shadow-sm border border-base-300 hover:border-primary transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-lg font-bold">{c.label}</h3>
              <p className="text-sm text-base-content/70">{c.text}</p>
            </Link>
          ))}
        </div>
      </Section>

      <HowItWorks />
      <HostGuarantee />
    </>
  );
}
