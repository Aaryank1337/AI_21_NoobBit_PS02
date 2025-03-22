import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import chatRoutes from "./routes/faq_route.js";
import KnowledgeBase from "./model/faq_model.js";

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server ONLY after successful connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", chatRoutes);
  
app.get("/api/test-db", async (req, res) => {
  const allDocs = await KnowledgeBase.find();
  res.json(allDocs);
});
