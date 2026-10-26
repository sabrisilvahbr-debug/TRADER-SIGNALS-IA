import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return <main className="mx-auto max-w-md p-6"><h1 className="text-3xl font-bold">Entrar</h1><AuthForm mode="login" /><p className="mt-4 text-sm">Ainda não tem conta? <Link className="text-cyan-600" href="/register">Criar conta</Link></p></main>;
}
