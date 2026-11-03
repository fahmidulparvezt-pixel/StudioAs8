"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

function EditStudio() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: s, loading, error } = useApi(`/studios/${id}`);
  const [busy, setBusy] = useState(false);

  if (loading) return <Spinner label="Loading listing…" />;
  if (error || !s) return <div className="py-16"><EmptyState title="Listing not found" text={error} href="/my-listings" cta="My Studio Listings" /></div>;
  if (s.ownerEmail !== session?.user?.email) return <div className="py-16"><EmptyState title="This is not your listing" text="You can only edit studios you host." href="/my-listings" cta="My Studio Listings" /></div>;

  async function save(body) {
    setBusy(true);
    try {
      await api(`/studios/${id}`, { method: "PATCH", body });
      toast.success("Studio updated.");
      router.push("/my-listings");
    } catch (e) { toast.error(e.message); setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-extrabold">Update studio</h1>
      <StudioForm initial={s} user={{ name: s.ownerName, email: s.ownerEmail }} submitting={busy} submitLabel="Save changes" onSubmit={save} />
    </div>
  );
}

export default function Page() { return <PrivateRoute><EditStudio /></PrivateRoute>; }
