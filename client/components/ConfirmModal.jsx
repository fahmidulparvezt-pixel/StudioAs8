"use client";

export default function ConfirmModal({ open, title, message, confirmText = "Confirm", busy, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-box">
        <h3 id="confirm-title" className="text-lg font-bold">{title}</h3>
        <p className="py-4 text-base-content/80">{message}</p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel} disabled={busy}>Keep it</button>
          <button className="btn btn-error" onClick={onConfirm} disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />}
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel} />
    </div>
  );
}
