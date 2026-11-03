"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { TableSkeleton } from "@/components/Skeletons";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

function Dashboard() {
  const { data: session } = authClient.useSession();
  const listings = useApi("/studios/mine");
  const mine = useApi("/bookings/mine");
  const incoming = useApi("/bookings/incoming");

  async function act(id, status) {
    try {
      await api(`/bookings/${id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Booking ${status.toLowerCase()}.`);
      incoming.reload();
    } catch (e) { toast.error(e.message); }
  }

  const stats = [
    { label: "My listings", value: listings.data?.length ?? "–", href: "/my-listings" },
    { label: "My bookings", value: mine.data?.length ?? "–", href: "/my-bookings" },
    { label: "Pending requests", value: incoming.data?.filter((b) => b.status === "Pending").length ?? "–" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-extrabold">Dashboard</h1>
      <p className="mb-8 text-base-content/70">Welcome back, {session?.user?.name}.</p>
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const body = <div className="rounded-box border border-base-300 p-6"><p className="text-3xl font-bold">{s.value}</p><p className="text-base-content/70">{s.label}</p></div>;
          return s.href ? <Link key={s.label} href={s.href}>{body}</Link> : <div key={s.label}>{body}</div>;
        })}
      </div>
      <h2 className="mb-4 text-2xl font-bold">Booking requests for your studios</h2>
      {incoming.loading ? <TableSkeleton rows={3} /> : incoming.data?.length ? (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead><tr><th>Studio</th><th>Guest</th><th>When</th><th>Total</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {incoming.data.map((b) => (
                <tr key={b._id}>
                  <td className="font-semibold">{b.studioTitle}</td>
                  <td>{b.userName}<div className="text-xs text-base-content/70">{b.userEmail}</div></td>
                  <td>{b.date}<div className="text-xs">{b.startTime}–{b.endTime}</div></td>
                  <td>${b.total}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="space-x-2 text-right whitespace-nowrap">
                    {b.status === "Pending" && <><button onClick={() => act(b._id, "Confirmed")} className="btn btn-sm btn-success">Confirm</button><button onClick={() => act(b._id, "Cancelled")} className="btn btn-sm btn-outline">Decline</button></>}
                    {b.status === "Confirmed" && <button onClick={() => act(b._id, "Completed")} className="btn btn-sm btn-info">Mark complete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <EmptyState title="No booking requests yet" text="Requests for your studios will show up here." href="/add-studio" cta="Add New Studio" />}
    </div>
  );
}

export default function Page() { return <PrivateRoute><Dashboard /></PrivateRoute>; }
