const STYLES = {
  Pending: "badge-warning badge-soft",
  Confirmed: "badge-success badge-soft",
  Completed: "badge-info badge-soft",
  Cancelled: "badge-error badge-soft",
};
export default function StatusBadge({ status }) {
  return <span className={`badge ${STYLES[status] || "badge-ghost"}`}>{status}</span>;
}
