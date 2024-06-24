"use server";

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { addUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(mode, prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};
  if (!email.includes("@")) {
    errors.email = "please enter a valid email address.";
  }
  if (password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  const hashedPassword = hashUserPassword(password);

  try {
    const id = addUser(email, hashedPassword);
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: { email: "There is an account for entered email address." },
      };
    }
    throw error;
  }
}

export async function login(mode, prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: "Email address is invalid.",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        password: "Entered passowrd is wrong.",
      },
    };
  }
  await createAuthSession(id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return await login(prevState, formData);
  }
  return await signup(mode, prevState, formData);
}
