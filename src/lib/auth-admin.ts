import { auth } from "@/server/auth/auth";
import { dataBasePrisma } from "./dbPrisma";

export const verifyAdmin = async (req: Request) => {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.email) {
            return null;
        }

        // Double check with DB to ensure role is up to date and user is active
        const user = await dataBasePrisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || user.role !== "ADMIN") return null;

        return user;
    } catch (error) {
        console.error("verifyAdmin error:", error);
        return null;
    }
};
