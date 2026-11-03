import Link from "next/link";
import { LuAperture } from "react-icons/lu";

// TODO: put your logo file in /public/assets and set the path here, e.g. "/assets/logo.svg"
const LOGO_SRC = "";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight" aria-label="StudioSpace home">
      {LOGO_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={LOGO_SRC} alt="" className="h-8 w-8" />
      ) : (
        <LuAperture className="h-8 w-8 text-primary" aria-hidden />
      )}
      <span>Studio<span className="text-primary">Space</span></span>
    </Link>
  );
}
