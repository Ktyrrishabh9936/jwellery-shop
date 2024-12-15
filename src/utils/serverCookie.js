"use server"
import { cookies } from 'next/headers';

export async function getServerCookie(cookieName) {
  const cookieStore = cookies();
  const cookieValue = (await cookieStore).get(cookieName)?.value;
  return cookieValue || null; // Returns the cookie value or null if not found
}