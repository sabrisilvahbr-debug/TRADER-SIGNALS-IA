import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Acesso</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Entrar no painel</h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-slate-300">
            Acesse o sistema de sinais, carteira e IA para acompanhar o mercado com decisões mais estruturadas.
          </p>
        </div>

        <div>
          <AuthForm mode="login" />
          <p className="mt-4 text-center text-sm text-slate-400">
            Ainda não tem conta? <Link href="/register" className="text-cyan-300 hover:text-cyan-200">Criar conta</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
