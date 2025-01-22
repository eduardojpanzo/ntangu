import { SignJWT, jwtVerify } from "jose";

//const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(
  "X0UGfCFnqXbiJ16iNgU0PjtLWy7COFNw1RmXrXwm+xY="
);

type SessionPayload = {
  id: string;
  token: string;
  expiresAt: number;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10h")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    console.log("Failed to verify session");
  }
}

export async function createSession(id: string, token: string) {
  const expiresAt = 10 * 60 * 60;
  const session = await encrypt({ id, token, expiresAt });

  localStorage.setItem("session-ntangu", session);
}

export async function getSession() {
  const session = localStorage.getItem("session-ntangu");
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession() {
  const session = localStorage.getItem("session-ntangu");
  const payload = await decrypt(session?.toString());

  if (!session || !payload) {
    return null;
  }

  // const expires = 10 * 60 * 60;

  localStorage.setItem("session-ntangu", session);
}

export async function deleteSession() {
  localStorage.removeItem("session-ntangu");
}
