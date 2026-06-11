import { useState } from "react";

// Inline bulletin-board composer. Posts straight to the Google Form's
// formResponse endpoint with a no-cors POST — the family never leaves
// the dashboard. Because no-cors responses are opaque, success is
// optimistic: we add the note locally and let the CSV poll reconcile.
// If the form field IDs aren't configured yet, degrades to opening
// the form in a new tab.
export function NoteComposer({ formConfig, onPosted }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(
    () => localStorage.getItem("beachhaus-name") ?? ""
  );
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle | posting | posted

  const wired = formConfig.entryName && formConfig.entryNote;

  if (!wired) {
    return (
      <a
        href={formConfig.viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-sm font-bold text-white bg-[var(--color-coral)] rounded-full px-4 py-2 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral)]"
      >
        Leave a note
      </a>
    );
  }

  async function post() {
    const trimmedName = name.trim();
    const trimmedNote = note.trim();
    if (!trimmedName || !trimmedNote) return;

    setStatus("posting");
    localStorage.setItem("beachhaus-name", trimmedName);

    const body = new URLSearchParams({
      [formConfig.entryName]: trimmedName,
      [formConfig.entryNote]: trimmedNote,
    });

    try {
      await fetch(formConfig.actionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
    } catch {
      // Opaque request: network errors are the only observable failure,
      // and even then the optimistic note keeps the board responsive.
    }

    onPosted({
      name: trimmedName,
      message: trimmedNote,
      postedAt: new Date(),
      optimistic: true,
    });
    setNote("");
    setStatus("posted");
    setTimeout(() => setStatus("idle"), 2500);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-sm font-bold text-white bg-[var(--color-coral)] rounded-full px-4 py-2 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral)]"
      >
        Leave a note
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        maxLength={40}
        className="w-full rounded-lg border border-stone-300 bg-white/80 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline focus:outline-2 focus:outline-[var(--color-coral)]"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Your note for the house…"
        rows={2}
        maxLength={280}
        className="w-full rounded-lg border border-stone-300 bg-white/80 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline focus:outline-2 focus:outline-[var(--color-coral)] resize-none"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={post}
          disabled={status === "posting" || !name.trim() || !note.trim()}
          className="text-sm font-bold text-white bg-[var(--color-coral)] rounded-full px-4 py-2 disabled:opacity-40 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral)]"
        >
          {status === "posting" ? "Posting…" : "Post to the board"}
        </button>
        {status === "posted" && (
          <span className="text-sm font-semibold text-emerald-700">
            Posted ✓
          </span>
        )}
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-stone-500 hover:text-stone-700 ml-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}
