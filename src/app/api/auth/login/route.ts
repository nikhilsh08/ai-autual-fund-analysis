import { NextRequest, NextResponse } from "next/server";
import { signIn, auth } from "@/server/auth/auth";
import { loginSchema } from "@/server/auth/schemas/auth.schema";
import { AuthError } from "next-auth";
import { dataBasePrisma } from "@/lib/dbPrisma";

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

    // If signIn didn't throw, the login was successful.
    // Fetch user to return details as requested
    const user = await dataBasePrisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found after login" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        isAdmin: user.role === "ADMIN"
      }
    }, { status: 200 });

  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}