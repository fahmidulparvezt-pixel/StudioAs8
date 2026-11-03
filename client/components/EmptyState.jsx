import Link from "next/link";
import { LuAperture } from "react-icons/lu";

export default function EmptyState({ title, text, href, cta }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-box border border-dashed border-base-content/30 p-10 text-center">
      <LuAperture className="h-10 w-10 text-primary" aria-hidden />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-base-content/70">{text}</p>
      {href && <Link href={href} className="btn btn-primary mt-2">{cta}</Link>}
    </div>
  );
}
