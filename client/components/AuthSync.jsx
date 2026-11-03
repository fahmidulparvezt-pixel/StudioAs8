"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { clearToken, issueToken } from "@/lib/api";

// Keeps the HTTPOnly JWT cookie in step with the BetterAuth session (also on every page reload).
export default function AuthSync() {
  const { data, isPending } = authClient.useSession();
  const uid = data?.user?.id;

  useEffect(() => {
    if (isPending) return;
    if (uid) issueToken().catch(() => {});
    else clearToken().catch(() => {});
  }, [uid, isPending]);

  return null;
}
