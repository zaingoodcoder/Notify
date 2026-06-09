import SideBar from "../components/SideBar";
import Footer from "../components/footer";
import { secdata } from "../data/normaldata";



export default function Home() {

 
  return (

    <main className="flex flex-1 flex-col overflow-hidden text-zinc-100">
      {/* Hero — flex-1 + items-center vertically centers content in the space below the navbar */}
      <section className="relative flex w-full min-h-[calc(95dvh-5rem)] flex-1 flex-col items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(139,92,246,0.12),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-6 pt-[8.4rem] pb-[4.8rem] md:pt-[9.6rem] md:pb-24">
        <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>

          <h1 className="animate-fade-up-delay-1 select-none text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Your thoughts,{" "}
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              beautifully organized
            </span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-6 max-w-md text-lg leading-relaxed text-zinc-400 selection:bg-violet-600 selection:text-white">
            Notify is the modern workspace for notes, tasks, and ideas — designed
            to help you think clearly and move faster. Like your brain, but
            searchable.
          </p>

          <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4">
            <button className="btn-shimmer group relative select-none overflow-hidden rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                Start noting — it&apos;s free
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>

            <button className="group cursor-pointer select-none rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95">
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch demo
              </span>
            </button>
          </div>

          <p className="animate-fade-up-delay-3 mt-5 text-xs text-zinc-500">
            No credit card required · Free for personal use
          </p>
        </div>

        <div className="animate-fade-up-delay-2">
          <SideBar />
        </div>
        </div>
        </div>
      </section>

      {/* Features strip */}
      <section
        id="features"
        className="border-t border-white/5 bg-zinc-950/80 py-16 backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
            {
              secdata.map((feature,i) => {
                return(
                  <div
                    key={i}
                    className="cursor-pointer group rounded-2xl border border-white/5 bg-white/2 p-6 transition-colors hover:border-indigo-500/20 hover:bg-indigo-500/5"
                    >
                    <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
                      {feature.desc}
                    </p>
      
                  </div>
    
                );
    
              })

            }

        </div>

      </section>

      <Footer />

    </main>

  );
}
