"use client";

import { useEffect, useState } from "react";

type MarketItem = {
  symbol: string;
  price: number;
  changePercent: number;
  signal: string;
  trend: string;
  confidence: number;
};

type SignalResponse = {
  marketSummary: string;
  marketOverview: MarketItem[];
  generatedAt: string;
};

export default function TradingDashboard() {
  const [data, setData] = useState<SignalResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/signal", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Falha ao consultar o mercado");
        return response.json();
      })
      .then(setData)
      .catch(() => setError("Não foi possível carregar os sinais agora."));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Dashboard</p>
          <h1 className="mt-2 text-3xl font-black">Sinais de mercado</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Acompanhe preço, tendência e confiança dos principais ativos.</p>
        </div>

        {error && <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">{error}</div>}
        {!data && !error && <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">Carregando sinais...</div>}
        {data && (
          <>
            <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-300">{data.marketSummary}</div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.marketOverview.map((item) => (
                <article key={item.symbol} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black">{item.symbol}</h2>
                    <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-200">{item.signal}</span>
                  </div>
                  <p className="mt-5 text-2xl font-bold">US$ {item.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                  <div className="mt-4 flex justify-between text-sm text-slate-400">
                    <span>{item.trend}</span>
                    <span className={item.changePercent >= 0 ? "text-emerald-300" : "text-rose-300"}>{item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%</span>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">Confiança: {item.confidence}%</div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
