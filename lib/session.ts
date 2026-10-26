import { cookies } from "next/headers";
import { verifySession, type SessionPayload } from "@/lib/auth";

export function getSessionUser(): SessionPayload | null {
  const token = cookies().get("trader_session")?.value;
  return token ? verifySession(token) : null;
}

export { hashPassword, verifyPassword, signSession } from "@/lib/auth";
