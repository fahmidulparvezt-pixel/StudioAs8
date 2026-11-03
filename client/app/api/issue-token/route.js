import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const cookieBase = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };

// Challenge 1: exchange a valid BetterAuth session for a JWT stored in an HTTPOnly cookie.
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id, email, name } = session.user;
  const token = jwt.sign({ id, email, name }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ss_token", token, { ...cookieBase, maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ss_token", "", { ...cookieBase, maxAge: 0 });
  return res;
}
