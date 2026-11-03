"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

function passwordProblem(pw) {
  if (pw.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter.";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pwError, setPwError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const problem = passwordProblem(fd.get("password"));
    setPwError(problem);
    if (problem) return toast.error(problem);
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
      image: fd.get("photo") || undefined,
    });
    if (error) {
      toast.error(error.message || "Could not create your account.");
      setBusy(false);
      return;
    }
    toast.success("Account created. Please log in.");
    router.push("/login");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="card w-full bg-base-100 shadow-md">
        <form onSubmit={onSubmit} className="card-body gap-3">
          <h1 className="text-3xl font-extrabold">Create your account</h1>
          <label className="form-control"><span className="mb-1 text-sm font-medium">Name</span>
            <input name="name" required className="input w-full" placeholder="Your full name" /></label>
          <label className="form-control"><span className="mb-1 text-sm font-medium">Email</span>
            <input name="email" type="email" required className="input w-full" placeholder="you@email.com" /></label>
          <label className="form-control"><span className="mb-1 text-sm font-medium">Photo URL</span>
            <input name="photo" type="url" className="input w-full" placeholder="https://…" /></label>
          <label className="form-control"><span className="mb-1 text-sm font-medium">Password</span>
            <input name="password" type="password" required className="input w-full" placeholder="Min 6 chars, upper and lower case" onChange={() => setPwError("")} /></label>
          {pwError && <p role="alert" className="text-sm text-error">{pwError}</p>}
          <button className="btn btn-primary" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Register</button>
          <div className="divider my-1">or</div>
          <button type="button" onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })} className="btn btn-outline"><FcGoogle className="h-5 w-5" /> Continue with Google</button>
          <p className="text-center text-sm">Already registered? <Link href="/login" className="link link-primary">Log in</Link></p>
        </form>
      </div>
    </div>
  );
}
