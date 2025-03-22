import express from "express";
import { readJSON, writeJSON } from "../src/lib/jsonHelper.js";
import { authenticateToken } from "../middleware/authMiddleware.js";



const router = express.Router();
const fileName = "production.json";

// Get all batch cards
router.get("/batches",authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  res.json(data.batch_cards || []);
});

// Get specific batch status
router.get("/batches/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await readJSON(fileName);
  const batch = data.batch_cards.find((b) => b.batch_number === id);
  res.json(batch || { message: "Batch not found" });
});

export default router;
