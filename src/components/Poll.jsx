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

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {pollConfig.options.map((opt) => {
          const isSelected = selected.has(opt);
          return (
            <li key={opt}>
              <button
                onClick={() => toggle(opt)}
                aria-pressed={isSelected}
                className={`rounded-full px-3 py-1.5 text-sm border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-coral)] ${
                  isSelected
                    ? "border-[var(--color-coral)] bg-[var(--color-coral)] text-white font-semibold"
                    : "border-stone-300 bg-white/50 text-stone-700 hover:bg-white/80"
                }`}
              >
                {isSelected ? "✓ " : ""}
                {opt}
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

      <div className="mt-5">
        <h3 className="font-[var(--font-display)] text-base text-[var(--color-driftwood)]">
          🏆 Standings
        </h3>
        {votes.length === 0 ? (
          <p className="text-sm text-stone-500 mt-2">
            No votes yet — be the first.
          </p>
        ) : (
          <ol className="mt-2 space-y-1.5">
            {votes.map((v, i) => {
              const pct = Math.max(8, Math.round((v.count / maxCount) * 100));
              const leader = i === 0;
              return (
                <li key={v.option} className="flex items-center gap-2 text-sm">
                  <span className="w-5 shrink-0 text-right text-xs font-bold text-stone-400 tabular-nums">
                    {i + 1}
                  </span>
                  <div className="relative flex-1 h-7 rounded-md bg-white/40 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-md transition-[width] duration-700 ${
                        leader
                          ? "bg-[var(--color-coral)]"
                          : "bg-[var(--color-seafoam)]"
                      }`}
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                    <span
                      className={`relative z-10 flex h-full items-center px-2 font-semibold ${
                        leader ? "text-white" : "text-stone-700"
                      }`}
                    >
                      {leader ? "👑 " : ""}
                      {v.option}
                    </span>
                  </div>
                  <span className="w-7 shrink-0 text-right font-bold text-stone-700 tabular-nums">
                    {v.count}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
