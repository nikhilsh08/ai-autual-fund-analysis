"use server";

import { registerSchema, RegisterInput } from "@/server/auth/schemas/auth.schema";
import { AuthService } from "@/server/auth/services/auth.service";

export async function register(values: RegisterInput) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const user = await AuthService.createUser({
      name,
      email,
      password,
      confirmPassword: password,
    });

    return { 
      success: "Registration successful! Please log in.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return { error: "Email already in use" };
      }
    }
    return { error: "Something went wrong" };
  }
}