"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.nativeEvent && "isComposing" in event.nativeEvent && event.nativeEvent.isComposing) return;
    setLoading(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "Não foi possível continuar."); setLoading(false); return; }
    router.push("/dashboard"); router.refresh();
  }
  return <form onSubmit={submit} className="space-y-4"><input name="name" placeholder="Nome" className={mode === "register" ? "w-full rounded border p-3" : "hidden"} required={mode === "register"} /><input name="email" type="email" placeholder="E-mail" className="w-full rounded border p-3" required /><input name="password" type="password" placeholder="Senha" className="w-full rounded border p-3" required minLength={6} /><button disabled={loading} className="w-full rounded bg-cyan-500 p-3 font-semibold text-slate-950">{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}</button>{error && <p className="text-sm text-red-500">{error}</p>}</form>;
}
