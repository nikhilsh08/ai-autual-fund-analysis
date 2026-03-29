'use server'

import axios from 'axios';

export const registerNewsletter = async (email: string) => {
    try {
        console.log("Email to register:", email);

        if (!email) {
            return { success: false, error: "Email address is required." };
        }

        const listId = process.env.EMAILOCTOPUS_LIST_ID?.trim();
        const apiKey = process.env.EMAILOCTOPUS_API_KEY?.trim();
        console.log(listId, apiKey);

        const response = await axios.post(
            `https://api.emailoctopus.com/lists/${listId}/contacts`,
            {
                email_address: email,
                status: 'pending'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );
        console.log("API Response:", response.data);
        return {
            success: true,
            message: "Subscription successful. Please check your email to confirm.",
            data: response.data
        };

    } catch (error: any) {
        console.error("Newsletter Error:", error?.response?.data?.detail);
        if (error?.response?.data?.detail) {
            return {
                success: false,
                error: "Email address already subscribed.",
                message: error?.response?.data?.detail,
            };
        }
        return {
            success: false,
            error: "Internal server error.",
            details: error.message
        };
    }
};
