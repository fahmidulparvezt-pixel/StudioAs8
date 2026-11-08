"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaXTwitter, FaInstagram, FaYoutube, FaGithub } from "react-icons/fa6";
import Logo from "@/components/Logo";
import { CATEGORY_INFO } from "@/lib/constants";

export default function Footer() {
  function subscribe(e) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    toast.success(`Thanks! We'll send studio news to ${email}.`);
    e.currentTarget.reset();
  }

  return (
    <footer className="border-t-4 border-primary bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm opacity-80">
            StudioSpace connects creators with the rooms they need: photo cycs, sound stages, podcast lounges and music suites, booked by the hour.
          </p>
          <div className="flex gap-3 text-xl">
            <a href="https://x.com" aria-label="StudioSpace on X" target="_blank" rel="noreferrer"><FaXTwitter /></a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer"><FaYoutube /></a>
            <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noreferrer"><FaGithub /></a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Quick links</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/" className="hover:text-accent">Home</Link></li>
            <li><Link href="/studios" className="hover:text-accent">Explore Studios</Link></li>
            <li><Link href="/how-it-works" className="hover:text-accent">How It Works</Link></li>
            <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Popular categories</h3>
          <ul className="space-y-2 text-sm opacity-80">
            {CATEGORY_INFO.map((c) => (
              <li key={c.key}><Link href={`/studios?category=${encodeURIComponent(c.key)}`} className="hover:text-accent">{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Newsletter</h3>
          <form onSubmit={subscribe} className="join w-full">
            <input name="email" type="email" required placeholder="you@email.com" aria-label="Email address" className="input join-item w-full text-base-content" />
            <button className="btn btn-primary join-item">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} StudioSpace. All rights reserved. Use of this site is subject to our Terms and Privacy Policy.
      </div>
    </footer>
  );
}
