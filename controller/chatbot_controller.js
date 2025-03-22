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


export function determineIntent(message) {
  const msgLower = message.toLowerCase();

  if (msgLower.includes("tax invoice") || msgLower.includes("proforma")) {
    return "invoice_types";
  }
  if (msgLower.includes("reverse charge") || msgLower.includes("rcm")) {
    return "reverse_charge";
  }
  if (msgLower.includes("gst return") || msgLower.includes("gst returns")) {
    return "gst_return_generation";
  }
  if (msgLower.includes("gst") || msgLower.includes("tax")) {
    return "gst_general";
  }
  if (msgLower.includes("sales")) {
    return "sales_module";
  }
  if (msgLower.includes("purchase") || msgLower.includes("po")) {
    return "purchase_module";
  }
  if (msgLower.includes("inventory") || msgLower.includes("stock")) {
    return "stores_module";
  }
  if (msgLower.includes("production") || msgLower.includes("batch")) {
    return "production_module";
  }
  if (msgLower.includes("quality") || msgLower.includes("inspection")) {
    return "quality_module";
  }
  if (msgLower.includes("dispatch") || msgLower.includes("shipment") || msgLower.includes("tracking")) {
    return "dispatch_module";
  }
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
      const generatedText = response.data[0]?.generated_text || "";
      
      // Remove the prompt part from the generated response
      return generatedText.replace(prompt, "").trim();
    } else {
      console.error("Unexpected LLM API response:", response.data);
      return "I couldn't find an answer.";
    }
  } catch (error) {
    console.error("LLM API error:", error?.response?.data || error.message);
    return "LLM service is unavailable.";
  }
}
