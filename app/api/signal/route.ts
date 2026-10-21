import { NextResponse } from "next/server";

import { buildDashboardPayload } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await buildDashboardPayload();
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Erro ao montar payload do dashboard:", error);
    return NextResponse.json({ error: "Falha ao montar sinais" }, { status: 500 });
  }
}
