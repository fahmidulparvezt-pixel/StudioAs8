"use client";

import { useState } from "react";

const images = [
  "/images/categories/photography/photography-hero-1.webp",
  "/images/categories/photography/photography-hero-2.webp",
  "/images/categories/photography/photography-hero-3.webp",
];

export default function PhotographyHero() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative min-h-[650px] flex items-center overflow-hidden bg-black">

      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            active === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">

        <p className="uppercase tracking-[5px] text-sm mb-6">
          Photography Studio
        </p>

        <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-6">
          Capture Every Moment,
          <br />
          Create Timeless Memories
        </h1>

        <p className="text-gray-200 text-base md:text-xl max-w-2xl mx-auto mb-8">
          Discover professional photographers and creative studios
          to bring your vision to life.
        </p>

        <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition">
          Explore Studios
        </button>

        <div className="flex justify-center gap-3 mt-12">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                active === index
                  ? "w-10 bg-white"
                  : "w-3 bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}