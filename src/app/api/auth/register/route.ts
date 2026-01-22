import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/server/auth/schemas/auth.schema"
import { AuthService } from "@/server/auth/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validatedData.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // Create user
    const user = await AuthService.createUser(validatedData.data);

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}