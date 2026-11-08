"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

function Bookings() {
  const { data, loading, error, reload } = useApi("/bookings/mine");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function cancel() {
    setBusy(true);
    try {
      await api(`/bookings/${target._id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled.");
      setTarget(null);
      reload();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-extrabold">My bookings</h1>
      {loading ? <TableSkeleton /> : error ? <p className="text-error">{error}</p> : data?.length ? (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table table-zebra">
            <thead class = "bg-base-200"><tr><th>Studio</th><th>Date</th><th>Time</th><th>Total</th><th>Status</th><th className="text-right">Action</th></tr></thead>
            <tbody>
              {data.map((b) => (
                <tr key={b._id}>
                  <td><Link href={`/studios/${b.studioId}`} className="font-semibold hover:underline">{b.studioTitle}</Link><div className="text-xs text-base-content/70">{b.studioLocation}</div></td>
                  <td>{b.date}</td>
                  <td>{b.startTime}–{b.endTime}</td>
                  <td>${b.total}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="text-right">{b.status === "Pending" && <button onClick={() => setTarget(b)} className="btn btn-sm btn-error btn-outline">Cancel Booking</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <EmptyState title="No bookings yet" text="Find a studio and send your first booking request." href="/studios" cta="Explore Studios" />}
      <ConfirmModal open={!!target} title="Cancel this booking?" message={`Your request for ${target?.studioTitle} on ${target?.date} will be cancelled.`} confirmText="Cancel booking" busy={busy} onConfirm={cancel} onCancel={() => setTarget(null)} />
    </div>
  );
}

export default function Page() { return <PrivateRoute><Bookings /></PrivateRoute>; }
