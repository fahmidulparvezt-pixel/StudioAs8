// All API calls go through the /backend rewrite so the HTTPOnly cookie is sent automatically.
export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`/backend${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

export const issueToken = () => fetch("/api/issue-token", { method: "POST", credentials: "include" });
export const clearToken = () => fetch("/api/issue-token", { method: "DELETE", credentials: "include" });
