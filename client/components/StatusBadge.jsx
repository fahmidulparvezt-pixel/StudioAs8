const STYLES = { Pending: "badge-warning", Confirmed: "badge-success", Completed: "badge-info", Cancelled: "badge-error" };

export default function StatusBadge({ status }) {
  return <span className={`badge ${STYLES[status] || "badge-ghost"}`}>{status}</span>;
}
