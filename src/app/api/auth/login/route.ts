import { NextRequest, NextResponse } from "next/server";
import { signIn, auth } from "@/server/auth/auth";
import { loginSchema } from "@/server/auth/schemas/auth.schema";
import { AuthError } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validatedData.data;

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          default:
            return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
        }
      }
      throw error;
    }

    // We don't call auth() here because it reads the *incoming* request cookies,
    // which won't have the new session cookie yet.
    // If signIn didn't throw, the login was successful.

    return NextResponse.json({
      message: "Login successful",
      // user: session.user, // Cannot return user immediately without reading DB again or decoding token manually
    }, { status: 200 });

  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}