import bcrypt from "bcrypt";
import { dataBasePrisma } from "../../../lib/dbPrisma";
import { RegisterInput } from "../schemas/auth.schema";
// import { Role } from "@prisma/client";

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getUserByEmail(email: string) {
    return dataBasePrisma.user.findUnique({
      where: { email },
    });
  }

  static async getUserById(id: string) {
    return dataBasePrisma.user.findUnique({
      where: { id },
    });
  }

  static async createUser(data: RegisterInput) {
    const { name, email, password } = data;

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    return dataBasePrisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });
  }
  static async authenticateUser(email:string, password:string){
    const user = await this.getUserByEmail(email);
    if(!user || !user.password){
      return null;
    }
    const isValidPassword = await this.comparePassword(password, user.password);
    return isValidPassword ? {success:true,user} : null;
  }

  static async updateUserEmailVerification(userId: string) {
    return dataBasePrisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });
  }
}