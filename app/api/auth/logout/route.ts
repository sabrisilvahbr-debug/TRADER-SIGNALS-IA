import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { hashPassword, signSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
    }

    const user = db.prepare("SELECT id, name, email, password FROM users WHERE email = ?").get(email) as
      | { id: number; name: string; email: string; password: string }
      | undefined;

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

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
    console.error("Erro ao realizar login:", error);
    return NextResponse.json({ error: "Falha ao autenticar usuário." }, { status: 500 });
  }
}
