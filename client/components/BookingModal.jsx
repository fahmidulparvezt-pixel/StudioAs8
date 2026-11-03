"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const today = () => new Date().toISOString().slice(0, 10);
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

export default function BookingModal({ studio, open, onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({ date: today(), startTime: "10:00", endTime: "12:00" });
  const [taken, setTaken] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    api(`/bookings/availability/${studio._id}?date=${form.date}`).then(setTaken).catch(() => setTaken([]));
  }, [open, form.date, studio._id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const hours = Math.max(0, (toMin(form.endTime) - toMin(form.startTime)) / 60);
  const total = hours * studio.hourlyRate;

  async function submit(e) {
    e.preventDefault();
    if (hours <= 0) return toast.error("End time must be after the start time.");
    setBusy(true);
    try {
      await api("/bookings", { method: "POST", body: { studioId: studio._id, ...form } });
      toast.success("Booking request sent. The host will confirm it soon.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;
  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="book-title">
      <form onSubmit={submit} className="modal-box space-y-3">
        <h3 id="book-title" className="text-lg font-bold">Book {studio.title}</h3>
        <label className="form-control"><span className="mb-1 text-sm font-medium">Date</span>
          <input type="date" min={today()} required value={form.date} onChange={set("date")} className="input w-full" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="form-control"><span className="mb-1 text-sm font-medium">Start</span>
            <input type="time" required value={form.startTime} onChange={set("startTime")} className="input w-full" /></label>
          <label className="form-control"><span className="mb-1 text-sm font-medium">End</span>
            <input type="time" required value={form.endTime} onChange={set("endTime")} className="input w-full" /></label>
        </div>
        {taken.length > 0 && (
          <div className="alert alert-warning text-sm">
            Already booked that day: {taken.map((t) => `${t.startTime}–${t.endTime}`).join(", ")}
          </div>
        )}
        <div className="rounded-box bg-base-200 p-3 text-sm">
          <p>{hours} hr × ${studio.hourlyRate} = <strong>${total.toFixed(2)}</strong></p>
          {studio.securityDeposit > 0 && <p className="text-base-content/70">Refundable security deposit: ${studio.securityDeposit}</p>}
        </div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Send booking request</button>
        </div>
      </form>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
