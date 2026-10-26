import { NextResponse } from "next/server";

import { getMarketOverview } from "@/lib/market";

export async function GET() {
  try {
    const marketOverview = await getMarketOverview();
    const alerts = marketOverview.marketOverview
      .filter((item) => item.signal !== "AGUARDE")
      .map((item) => ({
        symbol: item.symbol,
        signal: item.signal,
        price: item.price,
        changePercent: item.changePercent,
      }));

    return NextResponse.json({ alerts });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar os alertas." }, { status: 502 });
  }
}
