import Link from "next/link";

const features = [
  {
    title: "Dados reais",
    description: "Integração com a API pública da Binance para live market feed sem dados simulados.",
  },
  {
    title: "IA orientada a execução",
    description: "Resumo estratégico com suporte a OpenAI/Groq, com fallback técnico local quando necessário.",
  },
  {
    title: "Carteira e risco",
    description: "Acompanhamento de portfólio, distribuição por ativos e análise de risco em tempo real.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Trader Signals IA
            </div>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Sistema inteligente para sinais e execução de mercado.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Um painel moderno para monitorar ativos, captar sinais, avaliar risco e acompanhar IA aplicada ao mercado financeiro em tempo real.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Abrir dashboard
              </Link>
              <Link
                href="/watchlist"
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                Ver watchlist
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: "24/7", label: "Monitoramento" },
                { value: "5", label: "Ativos" },
                { value: "95%", label: "IA/analítica" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="text-2xl font-black text-cyan-300">{item.value}</div>
                  <div className="mt-2 text-sm text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Mercado</div>
                <div className="mt-2 text-3xl font-black text-white">Live</div>
              </div>
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Online
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { symbol: "BTCUSDT", price: "$68,430.12", change: "+2.46%" },
                { symbol: "ETHUSDT", price: "$3,510.42", change: "+1.88%" },
                { symbol: "SOLUSDT", price: "$164.12", change: "+4.12%" },
              ].map((item) => (
                <div key={item.symbol} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div>
                    <div className="font-bold text-slate-100">{item.symbol}</div>
                    <div className="text-sm text-slate-400">{item.price}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-300">{item.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Funcionalidades</p>
            <h2 className="mt-3 text-3xl font-black text-white">Tudo em um único cockpit de operação</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-xl text-cyan-300">
                  ✦
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
