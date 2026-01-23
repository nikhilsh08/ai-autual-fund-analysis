"use server";

import { signIn } from "@/server/auth/auth";
import { loginSchema, LoginInput } from "@/server/auth/schemas/auth.schema";
import { AuthError } from "next-auth";

export async function login(values: LoginInput) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return { success: "Logged in successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function loginWithOAuth(provider: "google" | "github" ) {
  try {
    await signIn(provider, {
      redirectTo: "/dashboard",
    });
  } catch (error) {
    throw error;
  }
}