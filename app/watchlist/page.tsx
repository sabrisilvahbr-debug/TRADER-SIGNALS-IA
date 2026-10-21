import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifySession } from "@/lib/auth";

export default function WatchlistPage() {
  const token = cookies().get("trader_session")?.value;
  if (!token) redirect("/login");

  const session = verifySession(token);
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Watchlist</p>
          <h1 className="mt-2 text-3xl font-black">Ativos favoritos</h1>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-300">
          Entre no dashboard e salve ativos para acompanhar sua watchlist.
        </div>
      </div>
    </main>
  );
}
