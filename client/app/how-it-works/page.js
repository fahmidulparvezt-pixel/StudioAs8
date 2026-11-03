import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";
import HostGuarantee from "@/components/HostGuarantee";

export const metadata = { title: "How It Works | StudioSpace" };

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-16 text-center">
        <h1 className="text-4xl font-extrabold">How StudioSpace works</h1>
        <p className="mt-3 text-base-content/70">Guests request a slot, hosts confirm it, and overlapping confirmed bookings are blocked automatically.</p>
      </div>
      <HowItWorks />
      <HostGuarantee />
      <div className="pb-16 text-center"><Link href="/studios" className="btn btn-primary">Explore Studios</Link></div>
    </>
  );
}
