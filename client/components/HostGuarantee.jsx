import { FiShield, FiUserCheck, FiTool, FiHeadphones } from "react-icons/fi";
import { Section, SectionHeading } from "@/components/Section";

const ITEMS = [
  { icon: FiShield, title: "Liability protection", text: "Every confirmed booking is recorded with its time, price and deposit, so both sides know the terms." },
  { icon: FiUserCheck, title: "Verified profiles", text: "Hosts and guests sign in with a verified account before they can list or book." },
  { icon: FiTool, title: "Equipment safety", text: "Hosts list the gear in each room, and guests can flag issues after their session." },
  { icon: FiHeadphones, title: "24/7 host support", text: "Questions about a booking or a listing? Our team answers around the clock." },
];

export default function HostGuarantee() {
  return (
    <Section>
      <SectionHeading title="Host guarantee & creator support" subtitle="Book and host with confidence." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((s) => (
          <div key={s.title} className="rounded-box border border-base-300 p-6">
            <s.icon className="mb-4 h-8 w-8 text-primary" aria-hidden />
            <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
            <p className="text-sm text-base-content/70">{s.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
