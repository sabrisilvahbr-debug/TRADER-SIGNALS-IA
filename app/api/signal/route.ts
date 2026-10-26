import { NextResponse } from "next/server";

import { getMarketOverview } from "@/lib/market";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getMarketOverview());
  } catch (error) {
    console.error("Erro ao montar sinais:", error);
    return NextResponse.json({ error: "Falha ao montar sinais" }, { status: 502 });
  }
}
