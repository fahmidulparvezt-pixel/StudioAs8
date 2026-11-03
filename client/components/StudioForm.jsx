"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import SmartImage from "@/components/SmartImage";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import { uploadImage } from "@/lib/imgbb";

export default function StudioForm({ initial, user, submitting, submitLabel, onSubmit }) {
  const [f, setF] = useState({
    title: initial?.title || "",
    category: initial?.category || CATEGORIES[0],
    hourlyRate: initial?.hourlyRate ?? "",
    securityDeposit: initial?.securityDeposit ?? "",
    capacity: initial?.capacity ?? "",
    location: initial?.location || "",
    imageUrl: initial?.imageUrl || "",
    galleryText: (initial?.gallery || []).join("\n"),
    amenities: initial?.amenities || [],
    overview: initial?.overview || "",
  });
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (a) => setF({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] });

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setF((p) => ({ ...p, imageUrl: url }));
      toast.success("Image uploaded.");
    } catch (err) { toast.error(err.message); } finally { setUploading(false); }
  }

  function submit(e) {
    e.preventDefault();
    onSubmit({
      title: f.title, category: f.category, hourlyRate: Number(f.hourlyRate), securityDeposit: Number(f.securityDeposit || 0),
      capacity: Number(f.capacity), location: f.location, imageUrl: f.imageUrl, amenities: f.amenities, overview: f.overview,
      gallery: f.galleryText.split("\n").map((x) => x.trim()).filter(Boolean),
    });
  }

  const field = "form-control";
  const label = "mb-1 text-sm font-medium";
  return (
    <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
      <label className={`${field} md:col-span-2`}><span className={label}>Title</span>
        <input required value={f.title} onChange={set("title")} className="input w-full" placeholder="e.g. North-light photo cyc" /></label>
      <label className={field}><span className={label}>Category</span>
        <select value={f.category} onChange={set("category")} className="select w-full">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label className={field}><span className={label}>Location / address</span>
        <input required value={f.location} onChange={set("location")} className="input w-full" placeholder="Street, area, city" /></label>
      <label className={field}><span className={label}>Hourly rate ($)</span>
        <input required type="number" min="1" value={f.hourlyRate} onChange={set("hourlyRate")} className="input w-full" /></label>
      <label className={field}><span className={label}>Security deposit ($)</span>
        <input type="number" min="0" value={f.securityDeposit} onChange={set("securityDeposit")} className="input w-full" /></label>
      <label className={field}><span className={label}>Max capacity (people)</span>
        <input required type="number" min="1" value={f.capacity} onChange={set("capacity")} className="input w-full" /></label>
      <div className={field}>
        <span className={label}>Image URL</span>
        <input value={f.imageUrl} onChange={set("imageUrl")} className="input w-full" placeholder="https://… or upload below" />
        <input type="file" accept="image/*" onChange={onFile} className="file-input mt-2 w-full" aria-label="Upload image" disabled={uploading} />
        {uploading && <span className="mt-1 text-sm text-base-content/70">Uploading…</span>}
      </div>
      <SmartImage src={f.imageUrl} alt="Studio preview" label="Preview appears here" className="h-40 w-full rounded-box md:col-span-2" />
      <label className={`${field} md:col-span-2`}><span className={label}>Gallery image URLs (one per line, optional)</span>
        <textarea value={f.galleryText} onChange={set("galleryText")} className="textarea h-24 w-full" /></label>
      <fieldset className="md:col-span-2">
        <legend className={label}>Amenities</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2"><input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={f.amenities.includes(a)} onChange={() => toggle(a)} />{a}</label>
          ))}
        </div>
      </fieldset>
      <label className={`${field} md:col-span-2`}><span className={label}>Detailed overview</span>
        <textarea required value={f.overview} onChange={set("overview")} className="textarea h-36 w-full" placeholder="Describe the space, house rules and what is included." /></label>
      <label className={field}><span className={label}>Host name</span><input readOnly value={user?.name || ""} className="input w-full opacity-70" /></label>
      <label className={field}><span className={label}>Host email</span><input readOnly value={user?.email || ""} className="input w-full opacity-70" /></label>
      <div className="md:col-span-2">
        <button className="btn btn-primary" disabled={submitting || uploading}>{submitting && <span className="loading loading-spinner loading-sm" />}{submitLabel}</button>
      </div>
    </form>
  );
}
