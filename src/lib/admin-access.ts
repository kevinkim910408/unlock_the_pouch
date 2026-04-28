import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const ADMIN_AUTH_COOKIE = "unlock_admin_auth";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_AUTH_COOKIE)?.value === "1";
}

export async function assertAdminAccess() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    notFound();
  }
}

