import express from "express";
import { readJSON, writeJSON } from "../src/lib/jsonHelper.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
const fileName = "stores.json";

// Get full inventory data
router.get("/inventory",authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  res.json(data.inventory || []);
});

// Get stock details for a specific SKU
router.get("/inventory/:sku", authenticateToken,async (req, res) => {
  const { sku } = req.params;
  const data = await readJSON(fileName);
  const stock = data.inventory.find((item) => item.sku === sku);
  res.json(stock || { message: "Stock not found" });
});

export default router;
