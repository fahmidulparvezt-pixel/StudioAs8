"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

function AddStudio() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const [busy, setBusy] = useState(false);

  async function save(body) {
    setBusy(true);
    try {
      await api("/studios", { method: "POST", body });
      toast.success("Studio listed successfully.");
      router.push("/my-listings");
    } catch (e) { toast.error(e.message); setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-extrabold">Add a new studio</h1>
      <StudioForm user={data?.user} submitting={busy} submitLabel="List studio" onSubmit={save} />
    </div>
  );
}

export default function Page() { return <PrivateRoute><AddStudio /></PrivateRoute>; }
