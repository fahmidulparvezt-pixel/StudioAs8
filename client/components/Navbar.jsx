"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiMenu } from "react-icons/fi";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import SmartImage from "@/components/SmartImage";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const MENU = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-studio", label: "Add New Studio" },
  { href: "/my-listings", label: "My Studio Listings" },
  { href: "/my-bookings", label: "My Bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const active = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function logout() {
    await authClient.signOut();
    await clearToken();
    toast.success("You have been logged out.");
    router.push("/");
  }

  const navLinks = LINKS.map((l) => (
    <li key={l.href}>
      <Link href={l.href} className={active(l.href) ? "border-b-2 border-primary font-semibold" : ""} aria-current={active(l.href) ? "page" : undefined}>
        {l.label}
      </Link>
    </li>
  ));

  return (
    <header className="sticky top-0 z-50 bg-neutral text-neutral-content shadow-md">
      <div className="navbar mx-auto max-w-7xl px-4">
        <div className="navbar-start gap-1">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Open menu"><FiMenu className="h-5 w-5" /></button>
            <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 text-base-content shadow">{navLinks}</ul>
          </div>
          <Logo />
        </div>
        <nav className="navbar-center hidden lg:flex" aria-label="Main">
          <ul className="menu menu-horizontal gap-1 px-1">{navLinks}</ul>
        </nav>
        <div className="navbar-end gap-2">
          <ThemeToggle />
          {isPending ? (
            <div className="skeleton h-10 w-10 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end dropdown-hover">
              <button tabIndex={0} className="btn btn-ghost btn-circle avatar" aria-label="Account menu">
                {user.image ? (
                  <SmartImage src={user.image} alt={user.name} className="h-10 w-10 rounded-full" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </button>
              <ul tabIndex={0} className="menu dropdown-content z-10 w-60 rounded-box bg-base-100 p-2 text-base-content shadow">
                <li className="menu-title text-base-content">{user.name}</li>
                {MENU.map((m) => <li key={m.href}><Link href={m.href}>{m.label}</Link></li>)}
                <li><button onClick={logout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Login</Link>
              <Link href="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
