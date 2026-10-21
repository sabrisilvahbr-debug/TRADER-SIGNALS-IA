import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { hashPassword, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: "Nome, e-mail e senha com no mínimo 6 caracteres são obrigatórios." }, { status: 400 });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;
    if (existing) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }

    const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashPassword(password));
    const user = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(result.lastInsertRowid) as {
      id: number;
      name: string;
      email: string;
    };

    const cookieValue = signSession({ userId: user.id, name: user.name, email: user.email });
    const response = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
    response.cookies.set("trader_session", cookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json({ error: "Não foi possível criar o usuário." }, { status: 500 });
  }
}
