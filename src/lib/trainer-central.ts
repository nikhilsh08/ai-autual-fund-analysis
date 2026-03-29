import axios from "axios";

const AUTH_URL = "https://accounts.zoho.in/oauth/v2/token";
const API_BASE_URL = "https://trainercentral.zoho.in";

// --- THE FIX: IN-MEMORY TOKEN CACHE ---
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getAccessToken() {
    if (!process.env.TC_REFRESH_TOKEN) {
        throw new Error("MISSING CREDENTIALS: .env file not loaded.");
    }

    // 1. Check if we already have a valid token saved in memory
    // (We leave a 5-minute buffer before it expires)
    if (cachedToken && Date.now() < tokenExpiryTime) {
        console.log("Using cached Zoho token for this request...");
        return cachedToken;
    }

    // 2. If no valid token, ask Zoho for a new one
    try {
        console.log("Generating NEW Zoho token...");
        const params = new URLSearchParams();
        params.append("refresh_token", process.env.TC_REFRESH_TOKEN);
        params.append("client_id", process.env.TC_CLIENT_ID!);
        params.append("client_secret", process.env.TC_CLIENT_SECRET!);
        params.append("grant_type", "refresh_token");

        const response = await axios.post(AUTH_URL, params);
        
        // Save the new token to our cache
        cachedToken = response.data.access_token;
        
        // Set expiry time for 55 minutes from now (Tokens last 60 mins)
        tokenExpiryTime = Date.now() + (55 * 60 * 1000); 

        return cachedToken;
    } catch (error: any) {
        console.error("TOKEN ERROR:", error.response?.data || error.message);
        throw new Error("Could not get Access Token");
    }
}

// --- ENROLLMENT FUNCTION ---
export async function enrollUserInTrainerCentral(
    type: string,
    email: string,
    fullName: string,
    tcCourseId: string
) {
    try {
        const token = await getAccessToken();
        const orgId = process.env.TC_ORG_ID;

        console.log(`Enrolling ${email} into Course ${tcCourseId} (Org: ${orgId})...`);

        // Split name into First and Last
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || firstName; 

        const url = `${API_BASE_URL}/api/v4/${orgId}/addCourseAttendee.json`;

        const body = {
            courseAttendee: {
                email: email,
                firstName: firstName,
                lastName: lastName,
                courseId: tcCourseId 
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
        const errorData = error.response?.data;
        const errorMessage = JSON.stringify(errorData || error.message).toLowerCase();

        if (errorMessage.includes("already") || errorMessage.includes("exists") || errorMessage.includes("duplicate")) {
            console.log(`INFO: User ${email} is already enrolled in course ${tcCourseId}. Skipping.`);
            return { status: "already_enrolled" };
        }

        console.error(
            "ENROLLMENT FAILED:",
            JSON.stringify(error.response?.data, null, 2) || error.message
        );
        return null;
    }
}