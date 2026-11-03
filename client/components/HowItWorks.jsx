import { FiSearch, FiClock, FiZap, FiFilm } from "react-icons/fi";
import { Section, SectionHeading } from "@/components/Section";

const STEPS = [
  { icon: FiSearch, title: "Discover Spaces", text: "Filter by category, location and price to find rooms that fit your project." },
  { icon: FiClock, title: "Select Shoot Hours", text: "Pick a date and your start and end time. The total updates as you choose." },
  { icon: FiZap, title: "Book Instantly", text: "Send your request in one click. Hosts confirm and you see the status in My Bookings." },
  { icon: FiFilm, title: "Create & Produce", text: "Arrive, set up and shoot. Mark the booking complete when you wrap." },
];

export default function HowItWorks() {
  return (
    <Section className="bg-base-200">
      <SectionHeading title="How booking works" subtitle="From search to set in four steps." />
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-box bg-base-100 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-content"><s.icon className="h-6 w-6" aria-hidden /></span>
              <span className="text-sm font-semibold text-base-content/60">Step {i + 1}</span>
            </div>
            <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
            <p className="text-sm text-base-content/70">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
