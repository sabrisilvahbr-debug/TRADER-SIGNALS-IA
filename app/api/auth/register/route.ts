import { cookies } from "next/headers";

import { verifySession } from "@/lib/auth";

function getSessionUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("trader_session")?.value;
    if (!token) return null;
    return verifySession(token);
  } catch {
    return null;
  }
}
