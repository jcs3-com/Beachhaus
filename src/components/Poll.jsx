import { useState } from "react";

// Pre-vacation poll. Selections post through the same Google Form
// pipeline as the House board, encoded as "#vote: a|b|c" — the
// announcements hook filters vote rows off the board and tallies them.
// Latest vote per name wins, so re-voting is allowed.
export function Poll({ pollConfig, formConfig, votes, onVoted }) {
  const [selected, setSelected] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("beachhaus-poll") ?? "[]"));
    } catch {
      return new Set();
    }
  });
  const [status, setStatus] = useState("idle"); // idle | posting | voted

  const wired = formConfig.entryName && formConfig.entryNote;
  const maxCount = Math.max(1, ...votes.map((v) => v.count));
  const countFor = (opt) => votes.find((v) => v.option === opt)?.count ?? 0;

  function toggle(opt) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(opt) ? next.delete(opt) : next.add(opt);
      return next;
    });
  }

  // Anonymous voting, no dedup: every submission counts toward the tally.
  async function submit() {
    if (selected.size === 0) return;
    setStatus("posting");
    localStorage.setItem("beachhaus-poll", JSON.stringify([...selected]));

    const message = "#vote: " + [...selected].join("|");
    try {
      await fetch(formConfig.actionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          [formConfig.entryName]: "poll",
          [formConfig.entryNote]: message,
        }),
      });
    } catch {
      // opaque request; optimistic regardless
    }
    onVoted([...selected]);
    setStatus("voted");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <div className="beach-card p-5">
      <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">
        {pollConfig.question}
      </h2>
      <p className="text-xs text-stone-500 mt-1">
        Pick as many as you like — change your mind anytime.
      </p>

      <ul className="mt-3 space-y-1.5">
        {pollConfig.options.map((opt) => {
          const count = countFor(opt);
          const pct = Math.round((count / maxCount) * 100);
          const isSelected = selected.has(opt);
          return (
            <li key={opt}>
              <button
                onClick={() => toggle(opt)}
                aria-pressed={isSelected}
                className={`relative w-full text-left rounded-lg px-3 py-2 text-sm overflow-hidden border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-coral)] ${
                  isSelected
                    ? "border-[var(--color-coral)] bg-white/70 font-semibold text-stone-800"
                    : "border-transparent bg-white/40 text-stone-700 hover:bg-white/60"
                }`}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-[var(--color-seafoam)] opacity-70 transition-[width] duration-700"
                  style={{ width: count ? `${pct}%` : "0%" }}
                  aria-hidden="true"
                />
                <span className="relative flex justify-between items-center">
                  <span>
                    {isSelected ? "✓ " : ""}
                    {opt}
                  </span>
                  {count > 0 && (
                    <span className="text-xs font-bold text-stone-600 tabular-nums">
                      {count}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {wired ? (
        <div className="mt-3 flex gap-3 items-center">
          <button
            onClick={submit}
            disabled={status === "posting" || selected.size === 0}
            className="text-sm font-bold text-white bg-[var(--color-coral)] rounded-full px-5 py-2 disabled:opacity-40 hover:opacity-90"
          >
            {status === "voted" ? "Voted ✓" : status === "posting" ? "…" : `Vote${selected.size ? ` (${selected.size})` : ""}`}
          </button>
          {status === "voted" && (
            <span className="text-xs text-stone-500">Counted! Vote again anytime.</span>
          )}
        </div>
      ) : (
        <p className="text-xs text-stone-500 mt-3">
          Make your picks — voting submits once the board is wired up.
        </p>
      )}
    </div>
  );
}
