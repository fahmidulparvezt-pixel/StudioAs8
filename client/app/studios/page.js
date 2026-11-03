"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StudioCard from "@/components/StudioCard";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { CATEGORIES } from "@/lib/constants";
import { useApi } from "@/lib/useApi";

function Explorer() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [sort, setSort] = useState("newest");

  useEffect(() => setCategory(params.get("category") || ""), [params]);
  useEffect(() => { const t = setTimeout(() => setQ(search), 350); return () => clearTimeout(t); }, [search]);

  const qs = new URLSearchParams({ sort });
  if (q) qs.set("search", q);
  if (category) qs.set("category", category);
  const { data, loading, error } = useApi(`/studios?${qs}`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-extrabold">Explore studios</h1>
      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_200px_200px]">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input w-full" placeholder="Search by name or location" aria-label="Search studios" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="select w-full" aria-label="Category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="select w-full" aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
        </select>
      </div>
      {loading ? <GridSkeleton /> : error ? <p className="text-center text-error">{error}</p> : data?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
      ) : (
        <EmptyState title="No studios match your search" text="Try a different keyword or category, or list your own space." href="/add-studio" cta="Add New Studio" />
      )}
    </div>
  );
}

export default function StudiosPage() {
  return <Suspense><Explorer /></Suspense>;
}
