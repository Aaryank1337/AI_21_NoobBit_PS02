import KnowledgeBase from "../model/faq_model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export async function findFromKnowledgeBase(message) {
  const intent = determineIntent(message);
  console.log("Determined intent:", intent);
  
  const directMatch = await KnowledgeBase.findOne({ intent: intent });
  console.log("Direct match result:", directMatch);
  if (directMatch) return directMatch.answer;

  // If no direct match, try keyword matching
  const keywords = extractKeywords(message);
  console.log("Extracted keywords:", keywords);
  const keywordMatch = await KnowledgeBase.findOne({
    keywords: { $in: keywords },
  });
  console.log("Keyword match result:", keywordMatch);
  return keywordMatch ? keywordMatch.answer : null;
}


function determineIntent(message) {
  const message_lower = message.toLowerCase();

  // Specific checks for certain FAQs
  if (message_lower.includes("tax invoice") || message_lower.includes("proforma")) {
    return "invoice_types";
  }

  if (message_lower.includes("reverse charge") || message_lower.includes("rcm"))
    return "reverse_charge";

  if (message_lower.includes("gst return") || message_lower.includes("gst returns"))
    return "gst_return_generation";

  // Then the generic checks
  if (message_lower.includes("gst") || message_lower.includes("tax"))
    return "gst_general";

  if (message_lower.includes("sales"))
    return "sales_module";

  return "general_query";
}

// Extract Keywords
function extractKeywords(message) {
  const commonWords = [
    "the", "and", "is", "in", "to", "how", "what", "why", "when", "where"
  ];
  return message
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2 && !commonWords.includes(word));
}

// Get LLM Response (Free API - Hugging Face)
export async function getLLMResponse(message) {
  try {
    const prompt = `<s>[INST] You are a helpful assistant for a financial system. Answer the following query: ${message} [/INST]</s>`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
      }
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]?.generated_text || "I couldn't find an answer.";
    } else {
      console.error("Unexpected LLM API response:", response.data);
      return "I couldn't find an answer.";
    }
  } catch (error) {
    console.error("LLM API error:", error?.response?.data || error.message);
    return "LLM service is unavailable.";
  }
}
