import { auth } from "@/server/auth/auth";
import { dataBasePrisma } from "./dbPrisma";
export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};