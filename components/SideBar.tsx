export default function SideBar() {
  return (
    <div className="animate-float relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-indigo-500/20 via-violet-500/10 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-zinc-950/80 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1 text-xs text-zinc-500">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            notify.app
          </div>
        </div>

        <div className="flex h-[340px]">
          {/* Sidebar */}
          <aside className="w-44 shrink-0 border-r border-white/5 bg-zinc-950/60 p-3">
            <div className="mb-4 flex items-center gap-2 px-1">
              <span className="text-sm font-semibold text-white">Notify</span>
            </div>

            <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Workspace
            </p>
            {["Daily Journal", "Project Ideas", "Meeting Notes"].map((item, i) => (
              <div
                key={item}
                className={`cursor-pointer mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                  i === 0
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-zinc-400 hover:bg-white/5"
                }`}
              >
              
                <span className="truncate">{item}</span>
              </div>
            ))}

            <p className="mb-2 mt-4 px-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Favorites
            </p>
            {["Q2 Roadmap", "Book List"].map((item) => (
              <div
                key={item}
                className="mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-400"
              >
                <span>⭐</span>
                <span className="truncate">{item}</span>
              </div>
            ))}
          </aside>

          {/* Editor */}
          <main className="flex-1 overflow-hidden p-5">
            <div className="mb-1 text-[10px] text-zinc-500">Daily Journal · Today</div>
            <h2 className="mb-4 text-lg font-semibold text-white">
              Morning reflections ✨
            </h2>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
              <p>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-indigo-300">
                  #goals
                </span>{" "}
                Ship the landing page and gather early feedback from users.
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-600 text-[10px] text-emerald-400">
                  ✓
                </span>
                Review wireframes with the team
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-600" />
                Write first blog post about Notify
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-600" />
                Set up collaboration invites
              </p>

              <div className="mt-4 rounded-lg border border-white/5 bg-white/5 p-3">
                <p className="text-[10px] font-medium text-zinc-500">Quick note</p>
                <p className="mt-1 text-zinc-300">
                  Ideas flow better when everything lives in one place.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
