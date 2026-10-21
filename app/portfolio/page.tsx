import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Conta</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Criar conta</h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-slate-300">
            Cadastre-se para acompanhar carteira, watchlist e sinais de mercado com IA aplicada à execução.
          </p>
        </div>

        <div>
          <AuthForm mode="register" />
          <p className="mt-4 text-center text-sm text-slate-400">
            Já possui cadastro? <Link href="/login" className="text-cyan-300 hover:text-cyan-200">Fazer login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
