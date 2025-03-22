import express from "express";
import { findFromKnowledgeBase, getLLMResponse } from "../controller/faq_controller.js";

const router = express.Router();

// API Route for handling chat queries
router.post("/query", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. Search Knowledge Base
        const knowledgeResponse = await findFromKnowledgeBase(message);
        if (knowledgeResponse) {
            return res.json({ response: knowledgeResponse, source: "knowledge_base" });
        }

        // 2. Fall back to Hugging Face API
        const llmResponse = await getLLMResponse(message);
        res.json({ response: llmResponse, source: "llm" });
    } catch (error) {
        console.error("Error processing query:", error);
        res.status(500).json({ error: "Failed to process query" });
    }
});

export default router;
