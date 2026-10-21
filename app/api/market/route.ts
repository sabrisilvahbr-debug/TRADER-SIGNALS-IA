import { NextResponse } from "next/server";

import { getMarketOverview } from "@/lib/market";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const market = await getMarketOverview();
    return NextResponse.json(market);
  } catch (error) {
    console.error("Erro ao buscar o mercado:", error);
    return NextResponse.json({ error: "Falha ao buscar dados reais do mercado" }, { status: 500 });
  }
}
