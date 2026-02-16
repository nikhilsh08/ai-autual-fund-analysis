import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { dataBasePrisma } from "../../lib/dbPrisma";
import { Role } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(dataBasePrisma) as any,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        await dataBasePrisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      // For credentials, verify email if needed
      if (!user.id) return false;

      const existingUser = await dataBasePrisma.user.findUnique({
        where: { id: user.id },
      });

      // Allow login even without email verification for now
      // Change this logic if you want to enforce email verification
      if (!existingUser) {
        return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.isOAuth = !!account;
      }

      if (!token.sub) return token;

      try {
        const existingUser = await dataBasePrisma.user.findUnique({
          where: { id: token.sub },
        });

        if (!existingUser) return token;

        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.isOAuth = !!account;

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
  },
  ...authConfig,
});