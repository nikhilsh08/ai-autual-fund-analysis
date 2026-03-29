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
            
            let userId: string | null = null;

            // --- Path 1: Session cookie (Next.js app users) ---
            try {
                const session = await auth();
                console.log("Session Check:", session ? `User found (${session.user?.role})` : "No session");
                if (session?.user?.role === "ADMIN" && session.user.id) {
                    userId = session.user.id;
                }
            } catch (authError) {
                console.error("Auth helper error:", authError);
            }

            // --- Path 2: Authorization Bearer token (cross-origin admin panel) ---
            if (!userId) {
                const authHeader = req.headers.get("authorization");
                const rawToken = authHeader?.startsWith("Bearer ") 
                    ? authHeader.substring(7).trim() 
                    : authHeader?.trim();

                if (rawToken) {
                    console.log("Bearer token detected, attempting decode...");
                    try {
                        // Use AUTH_SECRET if available (NextAuth v5 default), fallback to NEXTAUTH_SECRET
                        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
                        
                        if (!secret) {
                            console.error("Missing secret for JWT decoding (AUTH_SECRET or NEXTAUTH_SECRET)");
                        } else {
                            const decoded = await decode({
                                token: rawToken,
                                secret: secret,
                                salt: "authjs.session-token",
                            });

                            if (decoded?.email) {
                                console.log("Token decoded successfully for:", decoded.email);
                                const user = await dataBasePrisma.user.findUnique({
                                    where: { email: decoded.email as string },
                                    select: { id: true, role: true },
                                });
                                
                                if (user?.role === "ADMIN") {
                                    userId = user.id;
                                    console.log("User verified as ADMIN from token");
                                } else {
                                    console.warn("User from token is not an ADMIN:", user?.role);
                                }
                            } else {
                                console.warn("Token decoded but contained no email");
                            }
                        }
                    } catch (e) {
                        console.error("Bearer token decode failed:", e);
                    }
                } else {
                    console.log("No Bearer token found in headers");
                }
            }

            if (!userId) {
                console.error("UploadThing Middleware: Unauthorized access attempt");
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
