"use server";

import { dataBasePrisma } from "@/lib/dbPrisma";

export async function createNotificationRequestAction(email: string, courseId: string) {
    try {
        if (!email || !courseId) {
            return { success: false, message: "Email and course ID are required." };
        }

        // Validate course exists
        const course = await dataBasePrisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return { success: false, message: "Course not found." };
        }

        // Create the notification request
        const request = await dataBasePrisma.notificationRequest.upsert({
            where: {
                email_courseId: {
                    email,
                    courseId
                }
            },
            update: {}, // If it already exists, do nothing
            create: {
                email,
                courseId
            }
        });

        return {
            success: true,
            message: "You will be notified when this course is available.",
            request
        };
    } catch (error) {
        console.error("Notify Action Error:", error);
        return { success: false, message: "Server error. Please try again later." };
    }
}
