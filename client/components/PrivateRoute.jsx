"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

// Waits for the session check, so a logged-in user is never bounced to /login on reload.
export default function PrivateRoute({ children }) {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !data) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [isPending, data, pathname, router]);

  if (isPending || !data) return <Spinner label="Checking your session…" />;
  return children;
}
