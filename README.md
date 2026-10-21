"use client";

import { useEffect, useMemo, useState } from "react";

type SignalItem = {
  symbol: string;
  price: number;
  changePercent: number;
  signal: string;
  trend: string;
  bias: string;
  confidence: number;
  rsi: number;
  ema9: number;
  ema21: number;
};

type DashboardData = {
  generatedAt: string;
  marketSummary: string;
  marketOverview: SignalItem[];
  ai: {
    provider: string;
    summary: string;
    confidence: number;
    tradePlan: string[];
  };
  portfolio: {
    totalValue: number;
    allocations: { symbol: string; weight: number; value: number; color: string }[];
  };
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/signal", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Não foi possível carregar os sinais.");
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar o painel. Tente novamente em alguns segundos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const riskState = useMemo(() => {
    if (!data || !data.marketOverview.length) return "-";
    const avgConfidence = data.marketOverview.reduce((sum, item) => sum + item.confidence, 0) / data.marketOverview.length;
    if (avgConfidence >= 70) return "Alta";
    if (avgConfidence >= 55) return "Moderada";
    return "Baixa";
  }, [data]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#020817_35%,#020617_100%)] text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">TRADER SIGNALS IA</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Dashboard de execução inteligente</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
            >
              {loading ? "Atualizando..." : "Atualizar dados"}
            </button>
            {data && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                {new Date(data.generatedAt).toLocaleString("pt-BR")} • Feed em tempo real
              </div>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {!loading && !data ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
            Nenhum dado disponível no momento.
          </div>
        ) : null}

        {data && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Carteira total", value: currency.format(data.portfolio.totalValue), tone: "cyan" },
                { label: "Risco detectado", value: riskState, tone: "amber" },
                { label: "Ativos em tendência", value: data.marketOverview.filter((item) => item.trend === "Alta").length.toString(), tone: "emerald" },
                { label: "Provider IA", value: data.ai.provider.toUpperCase(), tone: "violet" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                  <div className={`mt-4 text-3xl font-black ${item.tone === "cyan" ? "text-cyan-300" : item.tone === "amber" ? "text-amber-300" : item.tone === "emerald" ? "text-emerald-300" : "text-violet-300"}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Sinais de mercado</h2>
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                    {data.marketOverview.length} ativos
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Ativo</th>
                        <th className="px-4 py-3">Preço</th>
                        <th className="px-4 py-3">24h</th>
                        <th className="px-4 py-3">RSI</th>
                        <th className="px-4 py-3">Sinal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                      {data.marketOverview.map((item) => (
                        <tr key={item.symbol} className="transition hover:bg-slate-800/60">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                              <div>
                                <div className="font-semibold text-slate-100">{item.symbol}</div>
                                <div className="text-xs text-slate-400">{item.trend} • {item.bias}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-100">{currency.format(item.price)}</td>
                          <td className={`px-4 py-3 font-semibold ${item.changePercent >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                            {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-slate-200">{item.rsi.toFixed(1)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                                item.signal === "COMPRA"
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                  : item.signal === "VENDA"
                                    ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                                    : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                              }`}
                            >
                              {item.signal}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
                  <h2 className="text-xl font-bold">Estratégia IA</h2>
                  <div className="mt-4 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-violet-300">Confiança</div>
                    <div className="mt-2 text-3xl font-black text-violet-200">{data.ai.confidence.toFixed(0)}%</div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{data.ai.summary}</p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
                  <h2 className="text-xl font-bold">Plano de execução</h2>
                  <ul className="mt-4 space-y-3">
                    {data.ai.tradePlan.map((step, index) => (
                      <li key={`${step}-${index}`} className="flex gap-3 text-sm text-slate-300">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-300">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Distribuição da carteira</h2>
                  <span className="text-sm text-slate-400">Alocação por peso</span>
                </div>

                <div className="space-y-4">
                  {data.portfolio.allocations.map((allocation) => (
                    <div key={allocation.symbol}>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span>{allocation.symbol}</span>
                        <span>{allocation.weight.toFixed(1)}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${allocation.weight}%`, background: allocation.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30">
                <h2 className="text-xl font-bold">Resumo do mercado</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{data.marketSummary}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {data.marketOverview.map((item) => (
                    <div key={item.symbol} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">{item.symbol}</div>
                      <div className="mt-2 text-lg font-bold text-slate-100">{currency.format(item.price)}</div>
                      <div className={`mt-1 text-sm font-semibold ${item.changePercent >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                        {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
