import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db";
import { cookies } from "next/headers";

// adapter provides database, user and session tables in specific database.
const adapter = new BetterSqlite3Adapter(db, {
  user: "user",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: { secure: process.env.NODE_ENV === "production" },
  },
});

export async function createAuthSession(userId) {
  // this function insert a session entity in database with unique sessionId.
  const session = await lucia.createSession(userId, {});
  // create a session cookie that holds all the data that should be set on that session cookie.
  const sessionCookie = lucia.createSessionCookie(session.id);
  // access to the cookie that belongs to the outgoing response.
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}
