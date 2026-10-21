import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifySession } from "@/lib/auth";
import TradingDashboard from "@/components/trading-dashboard";

export default function DashboardPage() {
  const token = cookies().get("trader_session")?.value;
  if (!token) redirect("/login");

  const session = verifySession(token);
  if (!session) redirect("/login");

  return <TradingDashboard />;
}
