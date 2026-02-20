import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Dropping Course_staticRoute_key index...");
        await prisma.$runCommandRaw({
            dropIndexes: "Course",
            index: "Course_staticRoute_key"
        });
        console.log("Successfully dropped index.");
    } catch (err) {
        console.error("Error dropping index (it might not exist or already be dropped):", err);
    }
}

main().finally(() => prisma.$disconnect());
