import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db";

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
