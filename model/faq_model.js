import mongoose from "mongoose";

// Define Knowledge Base Schema
const knowledgeBaseSchema = new mongoose.Schema({
  category: String,
  intent: String,
  question: String,
  answer: String,
  keywords: [String],
});

const KnowledgeBase = mongoose.model("KnowledgeBase", knowledgeBaseSchema);

export default KnowledgeBase; // Export the model
