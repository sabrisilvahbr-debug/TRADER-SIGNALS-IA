import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <main className="mx-auto max-w-md p-6"><h1 className="text-3xl font-bold">Criar conta</h1><AuthForm mode="register" /><p className="mt-4 text-sm">Já tem conta? <Link className="text-cyan-600" href="/login">Entrar</Link></p></main>;
}
