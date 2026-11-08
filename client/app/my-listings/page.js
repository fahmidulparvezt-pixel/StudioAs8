"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import { TableSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

function Listings() {
  const { data, loading, error, reload } = useApi("/studios/mine");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      await api(`/studios/${target._id}`, { method: "DELETE" });
      toast.success("Studio deleted.");
      setTarget(null);
      reload();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-extrabold">My studio listings</h1>
        <Link href="/add-studio" className="btn btn-primary">Add New Studio</Link>
      </div>
      {loading ? <TableSkeleton /> : error ? <p className="text-error">{error}</p> : data?.length ? (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table table-zebra">
            <thead class = "bg-base-200"><tr><th>Studio</th><th>Category</th><th>Rate</th><th>Location</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {data.map((s) => (
                <tr key={s._id}>
                  <td><div className="flex items-center gap-3"><SmartImage src={s.imageUrl} alt="" label="" className="h-12 w-16 rounded" /><Link href={`/studios/${s._id}`} className="font-semibold hover:underline">{s.title}</Link></div></td>
                  <td>{s.category}</td>
                  <td>${s.hourlyRate}/hr</td>
                  <td>{s.location}</td>
                  <td className="space-x-2 text-right whitespace-nowrap">
                    <Link href={`/studios/edit/${s._id}`} className="btn btn-sm">Update</Link>
                    <button onClick={() => setTarget(s)} className="btn btn-sm btn-error btn-outline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <EmptyState title="You have no listings yet" text="List your first studio and start receiving booking requests." href="/add-studio" cta="Add New Studio" />}
      <ConfirmModal open={!!target} title="Delete this studio?" message={`“${target?.title}” will be removed permanently. This cannot be undone.`} confirmText="Delete studio" busy={busy} onConfirm={remove} onCancel={() => setTarget(null)} />
    </div>
  );
}

export default function Page() { return <PrivateRoute><Listings /></PrivateRoute>; }
