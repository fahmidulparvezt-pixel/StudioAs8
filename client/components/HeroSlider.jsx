"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SmartImage from "@/components/SmartImage";

// TODO: set each slide's `image` to a URL or a file in /public/assets (e.g. "/assets/hero-1.jpg")
const SLIDES = [
  { image: "", title: "Find the room your next shoot needs", text: "Photo cycs, sound stages and podcast lounges, listed by the people who run them." },
  { image: "", title: "Book by the hour, create by the minute", text: "Pick a date and time, see transparent pricing, and send your request in seconds." },
  { image: "", title: "Got a space? Put it to work", text: "List your studio, set your rate and approve bookings that fit your calendar." },
];

export default function HeroSlider() {
  return (
    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true }} loop className="bg-neutral">
      {SLIDES.map((s, i) => (
        <SwiperSlide key={i}>
          <div className="relative flex h-[520px] items-center bg-neutral text-neutral-content">
            <SmartImage src={s.image} alt="" label={`Hero image ${i + 1}`} className="absolute inset-0 h-full w-full opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral via-neutral/70 to-transparent" />
            <div className="relative mx-auto w-full max-w-7xl px-4">
              <div className="max-w-xl space-y-5">
                <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">{s.title}</h1>
                <p className="text-lg opacity-90">{s.text}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                  <Link href="/studios" className="btn btn-outline border-neutral-content text-neutral-content">Host Your Space</Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
