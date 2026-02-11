import axios from "axios";

const AUTH_URL = "https://accounts.zoho.in/oauth/v2/token";
// Note: We use the generic domain, the token handles the routing
const API_BASE_URL = "https://trainercentral.zoho.in";

async function getAccessToken() {
    if (!process.env.TC_REFRESH_TOKEN) {
        throw new Error("MISSING CREDENTIALS: .env file not loaded.");
    }

    try {
        const params = new URLSearchParams();
        params.append("refresh_token", process.env.TC_REFRESH_TOKEN);
        params.append("client_id", process.env.TC_CLIENT_ID!);
        params.append("client_secret", process.env.TC_CLIENT_SECRET!);
        params.append("grant_type", "refresh_token");

        const response = await axios.post(AUTH_URL, params);
        return response.data.access_token;
    } catch (error: any) {
        console.error("TOKEN ERROR:", error.response?.data || error.message);
        throw new Error("Could not get Access Token");
    }
}

export async function enrollUserInTrainerCentral(
    email: string,
    fullName: string,
    tcCourseId: string
) {
    try {
        const token = await getAccessToken();
        const orgId = process.env.TC_ORG_ID;

        console.log(`Enrolling ${email} into Course ${tcCourseId} (Org: ${orgId})...`);

        // Split name into First and Last (Required by v4 API)
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "."; // Fallback if no last name

        // CORRECT API V4 ENDPOINT
        const url = `${API_BASE_URL}/api/v4/${orgId}/addCourseAttendee.json`;

        // CORRECT JSON BODY
        const body = {
            courseAttendee: {
                email: email,
                firstName: firstName,
                lastName: lastName,
                courseId: tcCourseId // Course ID goes inside the body now
            }
        };

        const response = await axios.post(url, body, {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
                "Content-Type": "application/json"
            },
        });

        console.log(`SUCCESS: Enrolled ${email}`);
        return response.data;

    } catch (error: any) {
        // Log the detailed error from Zoho to understand what failed
        console.error(
            "ENROLLMENT FAILED:",
            JSON.stringify(error.response?.data, null, 2) || error.message
        );
        return null;
    }
}