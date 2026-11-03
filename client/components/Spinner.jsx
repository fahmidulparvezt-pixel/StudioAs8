import { LuAperture } from "react-icons/lu";

export default function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3" role="status">
      <LuAperture className="h-12 w-12 animate-spin text-primary" aria-hidden />
      <p className="text-sm text-base-content/70">{label}</p>
    </div>
  );
}
