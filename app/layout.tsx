import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TRADER SIGNALS IA",
  description: "Dashboard de trading com IA para sinais reais de mercado",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
