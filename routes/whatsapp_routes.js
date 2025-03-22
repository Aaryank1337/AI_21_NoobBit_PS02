import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/whatsapp/webhook", async (req, res) => {
    const { Body, From } = req.body;

    console.log(`Received from ${From}: ${Body}`);

    try {
        // Forward the message to your chatbot
        const botResponse = await axios.post("http://localhost:5000/api/query", { message: Body });

        // Send the chatbot's response back to the user
        await axios.post("https://api.twilio.com/2010-04-01/Accounts/" + process.env.TWILIO_ACCOUNT_SID + "/Messages.json", new URLSearchParams({
            To: From,
            From: "whatsapp:+14155238886",            
            Body: botResponse.data.response,
        }), {
            auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN
            }
        });
        // res.sendStatus(200);
        // console.log("Final bot response:", botResponse.data.response);
    } catch (error) {
        console.error("Error handling WhatsApp message:", error);
        res.sendStatus(500);
    }
});

export default router;
