import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "trader-signals-ia-secret-dev";

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(`${AUTH_SECRET}:${password}`).digest("hex");
}

export function verifyPassword(password: string, hashedPassword: string) {
  return hashPassword(password) === hashedPassword;
}

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

function base64UrlEncode(input: string | Buffer) {
  const value = typeof input === "string" ? Buffer.from(input) : input;
  return value.toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf-8");
}

export function signSession(payload: SessionPayload) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, bodyB64, signature] = parts;
    const expected = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(`${headerB64}.${bodyB64}`)
      .digest("base64url");

    if (expected !== signature) return null;

    const payload = JSON.parse(base64UrlDecode(bodyB64)) as SessionPayload;
    if (!payload.userId || !payload.email || !payload.name) return null;

    return payload;
  } catch {
    return null;
  }
}
