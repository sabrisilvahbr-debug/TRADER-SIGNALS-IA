"use client";

import { useEffect, useState } from "react";

type WatchItem = {
  symbol: string;
  price: number;
  changePercent: number;
  signal: string;
};

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("trader-watchlist");
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch {
      setWatchlist([]);
    }
  }, []);

  useEffect(() => {
    async function load() {
      if (!watchlist.length) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/signal", { cache: "no-store" });
        const data = await response.json();
        const filtered = data.marketOverview.filter((item: any) => watchlist.includes(item.symbol));
        setItems(filtered.map((item: any) => ({
          symbol: item.symbol,
          price: item.price,
          changePercent: item.changePercent,
          signal: item.signal,
        })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [watchlist]);

  const clearAll = () => {
    setWatchlist([]);
    window.localStorage.setItem("trader-watchlist", JSON.stringify([]));
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Watchlist</p>
            <h1 className="mt-2 text-3xl font-black">Ativos favoritos</h1>
          </div>
          {watchlist.length > 0 && (
            <button
              onClick={clearAll}
              className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200"
            >
              Limpar lista
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">Carregando watchlist...</div>
        ) : items.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.symbol} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-black text-slate-100">{item.symbol}</div>
                  <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-200">
                    {item.signal}
                  </span>
                </div>
                <div className="mt-4 text-2xl font-bold text-white">US$ {item.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
                <div className={`mt-3 text-sm font-semibold ${item.changePercent >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                  {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-300">
            Ainda não há ativos salvos. Adicione ativos no dashboard para começar a acompanhar.
          </div>
        )}
      </div>
    </main>
  );
}



