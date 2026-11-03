"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { issueToken } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error: err } = await authClient.signIn.email({ email: fd.get("email"), password: fd.get("password") });
    if (err) {
      setError(err.message || "Email or password is incorrect.");
      toast.error(err.message || "Email or password is incorrect.");
      setBusy(false);
      return;
    }
    await issueToken();
    toast.success("Welcome back!");
    router.push(redirect);
  }

  async function google() {
    await authClient.signIn.social({ provider: "google", callbackURL: redirect });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="card w-full bg-base-100 shadow-md">
        <form onSubmit={onSubmit} className="card-body gap-3">
          <h1 className="text-3xl font-extrabold">Log in to StudioSpace</h1>
          <label className="form-control">
            <span className="mb-1 text-sm font-medium">Email</span>
            <input name="email" type="email" required className="input w-full" placeholder="you@email.com" />
          </label>
          <label className="form-control">
            <span className="mb-1 text-sm font-medium">Password</span>
            <input name="password" type="password" required className="input w-full" placeholder="Your password" />
          </label>
          <button type="button" className="link self-start text-sm" onClick={() => toast("Password reset is not available yet.")}>Forgot Password?</button>
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          <button className="btn btn-primary" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Login</button>
          <div className="divider my-1">or</div>
          <button type="button" onClick={google} className="btn btn-outline"><FcGoogle className="h-5 w-5" /> Continue with Google</button>
          <p className="text-center text-sm">New here? <Link href="/register" className="link link-primary">Create an account</Link></p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
