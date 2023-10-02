import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.COOKIE_SECRET) console.warn("No COOKIE_SECRET env var set");
if (!process.env.COOKIE_SECRET) throw new Error("No COOKIE_SECRET env var set");


const cookieSecret = process.env.COOKIE_SECRET


export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "_session",
      secrets: [cookieSecret],
      maxAge: 60 * 60 * 24 * 4, // 1 day
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  });