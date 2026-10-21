"use client";

import { useEffect, useState } from "react";

type Position = {
  id: number;
  symbol: string;
  quantity: number;
  avg_price: number;
  side: string;
  created_at: string;
};

export default function PortfolioPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/portfolio", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Não autenticado");
        }
        const data = await response.json();
        setPositions(data.positions || []);
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-slate-950 p-10 text-slate-200">Carregando carteira...</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Portfolio</p>
        <h1 className="mt-3 text-3xl font-black text-white">Carteira do usuário</h1>
      </div>

      {positions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-300">
          Ainda não há posições cadastradas. Use o dashboard para registrar operações.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {positions.map((position) => (
            <div key={position.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-black text-white">{position.symbol}</div>
                <div className={`rounded-full border px-2.5 py-1 text-xs font-bold ${position.side === "buy" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-rose-500/40 bg-rose-500/10 text-rose-300"}`}>
                  {position.side === "buy" ? "Compra" : "Venda"}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div className="flex justify-between"><span>Quantidade</span><span>{position.quantity}</span></div>
                <div className="flex justify-between"><span>Preço médio</span><span>US$ {position.avg_price}</span></div>
                <div className="flex justify-between"><span>Data</span><span>{new Date(position.created_at).toLocaleDateString("pt-BR")}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
