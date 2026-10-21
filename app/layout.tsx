import { NextResponse } from "next/server";

type AlertEntry = {
  id: string;
  symbol: string;
  direction: "above" | "below";
  threshold: number;
  createdAt: string;
};

const alerts = new Map<string, AlertEntry>();

export async function GET() {
  return NextResponse.json({ alerts: Array.from(alerts.values()) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, direction, threshold } = body;

    if (!symbol || !direction || typeof threshold !== "number") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const id = `${symbol}:${Date.now()}`;
    const entry: AlertEntry = {
      id,
      symbol: symbol.toUpperCase(),
      direction,
      threshold,
      createdAt: new Date().toISOString(),
    };

    alerts.set(id, entry);
    return NextResponse.json({ ok: true, alert: entry });
  } catch {
    return NextResponse.json({ error: "Falha ao criar alerta" }, { status: 500 });
  }
}



