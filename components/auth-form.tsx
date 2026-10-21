import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const rows = db
    .prepare("SELECT id, symbol, quantity, avg_price, side, created_at FROM positions WHERE user_id = ? ORDER BY created_at DESC")
    .all(user.userId) as Array<{
      id: number;
      symbol: string;
      quantity: number;
      avg_price: number;
      side: string;
      created_at: string;
    }>;

  return NextResponse.json({ positions: rows });
}

export async function POST(request: Request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const symbol = String(body.symbol || "").trim().toUpperCase();
    const quantity = Number(body.quantity || 0);
    const avgPrice = Number(body.avgPrice || 0);
    const side = String(body.side || "buy").toLowerCase();

    if (!symbol || !quantity || !avgPrice || !["buy", "sell"].includes(side)) {
      return NextResponse.json({ error: "Dados da posição inválidos." }, { status: 400 });
    }

    const result = db
      .prepare("INSERT INTO positions (user_id, symbol, quantity, avg_price, side) VALUES (?, ?, ?, ?, ?)")
      .run(user.userId, symbol, quantity, avgPrice, side);

    const position = db
      .prepare("SELECT id, symbol, quantity, avg_price, side, created_at FROM positions WHERE id = ?")
      .get(result.lastInsertRowid) as {
        id: number;
        symbol: string;
        quantity: number;
        avg_price: number;
        side: string;
        created_at: string;
      };

    return NextResponse.json({ ok: true, position });
  } catch (error) {
    console.error("Erro ao registrar posição:", error);
    return NextResponse.json({ error: "Falha ao salvar a posição." }, { status: 500 });
  }
}
