import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: Role;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User {
    role?: Role;
    emailVerified?: Date | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: Role;
    isOAuth?: boolean;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    emailVerified?: Date | null;
  }
}