import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, courseId } = body;

        if (!email || !courseId) {
            return NextResponse.json({ message: "Email and course ID are required." }, { status: 400 });
        }

        // Validate course exists
        const course = await dataBasePrisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ message: "Course not found." }, { status: 404 });
        }

        // Create the notification request
        // Using upsert or handling the unique constraint gracefully if the user already requested
        const request = await dataBasePrisma.notificationRequest.upsert({
            where: {
                email_courseId: {
                    email,
                    courseId
                }
            },
            update: {
                // If it already exists, maybe they clicked Notify Me again,
                // we'll just update the status back to PENDING if it was somehow NOTIFIED but they want it again.
                // Or do nothing. We'll leave it as is.
            },
            create: {
                email,
                courseId
            }
        });

        return NextResponse.json({
            success: true,
            message: "You will be notified when this course is available.",
            request
        });

    } catch (error) {
        console.error("Notify API Error:", error);
        return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 });
    }
}
