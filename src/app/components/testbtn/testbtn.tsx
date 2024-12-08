"use client"

import axios from "axios";

export default function TestBtn() {
    const handleCheckout = async () => {
        try {
            const response = await axios.post("/api/test");
            console.log("Response:", response.data);
        } catch (error:any) {
            console.error("Error:", error.response?.data || error.message);
        }
    };

    return <button onClick={handleCheckout}>Test</button>;
}
