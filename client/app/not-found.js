import Link from "next/link";
import SmartImage from "@/components/SmartImage";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-20 text-center">
      {/* TODO: add a studio illustration, e.g. src="/assets/404-studio.svg" */}
      <SmartImage src="/images/404-studio.svg" alt="Empty studio illustration" label="404 illustration" className="h-56 w-full max-w-sm rounded-box" />
      <h1 className="text-4xl font-extrabold">404: this set is empty</h1>
      <p className="text-base-content/70">The page you are looking for was moved or never existed.</p>
      <Link href="/" className="btn btn-primary">Return to Home</Link>
    </div>
  );
}
