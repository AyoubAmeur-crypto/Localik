import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_SECRET =
  process.env.SESSION_SECRET || "default_secret_string_32_chars_or_more";
const COOKIE_NAME = "localik_admin_session";
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  return hmac.digest("hex");
}

function encrypt(data: any): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function decrypt(token: string): any | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expectedSignature = sign(payload);
  
  // Constant time comparison to prevent timing attacks
  try {
    const isMatched = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
    if (!isMatched) return null;
  } catch (e) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
  } catch (e) {
    return null;
  }
}

export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
  const sessionData = { userId, email, expiresAt: expiresAt.getTime() };
  const token = encrypt(sessionData);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = decrypt(token);
  if (!session) return null;

  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    await destroySession();
    return null;
  }

  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
