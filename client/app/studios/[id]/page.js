"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { FiArrowLeft, FiCheck, FiMapPin, FiUsers } from "react-icons/fi";
import SmartImage from "@/components/SmartImage";
import BookingModal from "@/components/BookingModal";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

export default function StudioDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: user } = authClient.useSession();
  const { data: s, loading, error, reload } = useApi(`/studios/${id}`);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [busy, setBusy] = useState(false);

  if (loading) return <Spinner label="Loading studio…" />;
  if (error || !s) return <div className="py-16"><EmptyState title="Studio not found" text={error || "This listing may have been removed."} href="/studios" cta="Explore Studios" /></div>;

  const me = user?.user;
  const images = [s.imageUrl, ...(s.gallery || [])].filter(Boolean);
        console.log("Studio image URL:", s.imageUrl);
        console.log("All images:", images);

  function book() {
    if (!me) { toast("Log in to book this studio."); return router.push(`/login?redirect=/studios/${id}`); }
    if (me.email === s.ownerEmail) return toast.error("You cannot book your own studio.");
    setOpen(true);
  }

  async function submitReview(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api(`/studios/${id}/reviews`, { method: "POST", body: review });
      toast.success("Thanks for your review!");
      setReview({ rating: 5, comment: "" });
      reload();
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
       <Link href="/studios" className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
        <FiArrowLeft aria-hidden /> Back to all studios
         </Link>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="w-full rounded-box">
            {(images.length ? images : [""]).map((src, i) => (
              <SwiperSlide key={i}><SmartImage src={src} alt={`${s.title} photo ${i + 1}`} label="Gallery image" className="h-80 w-full md:h-[28rem]" /></SwiperSlide>
            ))}
          </Swiper>
          <section>
            <h2 className="mb-3 text-2xl font-bold">Overview</h2>
            <p className="whitespace-pre-line text-base-content/80">{s.overview}</p>
          </section>
          <section>
            <h2 className="mb-3 text-2xl font-bold">Amenities</h2>
            {s.amenities?.length ? (
              <ul className="grid gap-2 sm:grid-cols-2">{s.amenities.map((a) => <li key={a} className="flex items-center gap-2"><FiCheck className="text-success" aria-hidden />{a}</li>)}</ul>
            ) : <p className="text-base-content/70">The host has not listed amenities yet.</p>}
          </section>
          <section>
            <h2 className="mb-3 text-2xl font-bold">Reviews ({s.reviews?.length || 0})</h2>
            <div className="space-y-4">
              {s.reviews?.length ? s.reviews.map((r, i) => (
                <div key={i} className="rounded-box border border-base-300 p-4">
                  <div className="flex items-center justify-between"><strong>{r.name}</strong><span className="flex items-center gap-1"><FaStar className="text-warning" aria-hidden />{r.rating}</span></div>
                  <p className="mt-1 text-sm text-base-content/80">{r.comment}</p>
                </div>
              )) : <p className="text-base-content/70">No reviews yet. Book a session and be the first to share how it went.</p>}
            </div>
            {me && me.email !== s.ownerEmail && (
              <form onSubmit={submitReview} className="mt-5 space-y-3 rounded-box bg-base-200 p-4">
                <h3 className="font-semibold">Write a review</h3>
                <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} className="select w-full" aria-label="Rating">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 && "s"}</option>)}
                </select>
                <textarea required value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} className="textarea w-full" placeholder="How was the space?" />
                <button className="btn btn-primary" disabled={busy}>Post review</button>
              </form>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4 rounded-box border border-base-300 p-6 lg:sticky lg:top-24">
          <span className="badge badge-primary">{s.category}</span>
          <h1 className="text-3xl font-extrabold">{s.title}</h1>
          <p className="flex items-center gap-2 text-base-content/70"><FiMapPin aria-hidden />{s.location}</p>
          <p className="flex items-center gap-2 text-base-content/70"><FiUsers aria-hidden />Up to {s.capacity} people</p>
          <p className="flex items-center gap-1"><FaStar className="text-warning" aria-hidden />{s.rating ? s.rating.toFixed(1) : "No ratings yet"}</p>
          <p className="text-3xl font-bold">${s.hourlyRate}<span className="text-base font-normal text-base-content/70"> / hr</span></p>
          {s.securityDeposit > 0 && <p className="text-sm text-base-content/70">Security deposit: ${s.securityDeposit}</p>}
          <button onClick={book} className="btn btn-primary w-full">Book Workspace Now</button>
          <div className="border-t border-base-300 pt-4 text-sm">
            <p className="font-semibold">Hosted by {s.ownerName}</p>
            <p className="text-base-content/70">{s.ownerEmail}</p>
          </div>
        </aside>
      </div>
      <BookingModal studio={s} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
