import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/server/auth/auth";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { decode } from "next-auth/jwt";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
        .middleware(async ({ req }) => {
            console.log("====== UPLOADTHING MIDDLEWARE ======");
            console.log("URL:", req.url);
            console.log("Method:", req.method);
            console.log("Headers:", Object.fromEntries(req.headers.entries()));

            let userId: string | null = null;

            // --- Path 1: Session cookie (Next.js app users) ---
            const session = await auth();
            console.log("session", session);
            if (session?.user?.role === "ADMIN" && session.user.id) {
                userId = session.user.id;
            }

            // --- Path 2: Authorization Bearer token (cross-origin admin panel) ---
            if (!userId) {
                const authHeader = req.headers.get("authorization");
                const rawToken = authHeader?.replace("Bearer ", "").trim();

                if (rawToken) {
                    try {
                        const decoded = await decode({
                            token: rawToken,
                            secret: process.env.NEXTAUTH_SECRET!,
                            salt: "authjs.session-token",
                        });

                        if (decoded?.email) {
                            const user = await dataBasePrisma.user.findUnique({
                                where: { email: decoded.email as string },
                                select: { id: true, role: true },
                            });
                            if (user?.role === "ADMIN") {
                                userId = user.id;
                            }
                        }
                    } catch (e) {
                        console.error("Bearer token decode failed:", e);
                    }
                }
            }

            if (!userId) {
                throw new UploadThingError("Unauthorized");
            }

            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                await dataBasePrisma.image.create({
                    data: {
                        url: file.ufsUrl ?? file.url,
                        key: file.key,
                        name: file.name,
                    },
                });
                console.log("Upload complete for userId:", metadata.userId);
                console.log("file url", file.ufsUrl ?? file.url);
            } catch (e) {
                console.error("Error saving image to db", e);
            }

            return { uploadedBy: metadata.userId, url: file.ufsUrl ?? file.url };
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
