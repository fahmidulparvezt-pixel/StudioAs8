import Link from "next/link";

export const metadata = { title: "About Us | StudioSpace" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-16">
      <h1 className="text-4xl font-extrabold">About StudioSpace</h1>
      <p className="text-base-content/80">Good creative work needs the right room, and the right room is rarely free, nearby or fairly priced. StudioSpace is a peer-to-peer marketplace that lets studio owners list their spaces and lets creators book them by the hour.</p>
      <p className="text-base-content/80">We built it for photographers, filmmakers, podcasters, musicians and makers. Prices are shown up front, availability is checked for you, and every booking has a clear status from request to completion.</p>
      <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
    </div>
  );
}
