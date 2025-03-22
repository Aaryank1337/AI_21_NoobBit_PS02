import express from "express";
import { readJSON, writeJSON } from "../src/lib/jsonHelper.js";
import { authenticateToken } from "../middleware/authMiddleware.js";



const router = express.Router();
const fileName = "quality.json";

// Get all inspection reports
router.get("/inspections",authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  res.json(data.inspections || []);
});

// Get specific inspection details
router.get("/inspections/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await readJSON(fileName);
  const inspection = data.inspections.find((i) => i.inspection_id === id);
  res.json(inspection || { message: "Inspection not found" });
});

export default router;
