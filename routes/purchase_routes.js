import express from "express";
import { readJSON, writeJSON } from "../src/lib/jsonHelper.js";
import { authenticateToken } from "../middleware/authMiddleware.js";



const router = express.Router();
const fileName = "purchase.json";

// Get all purchase orders
router.get("/orders",authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  res.json(data.purchase_orders || []);
});

// Get a specific purchase order
router.get("/orders/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await readJSON(fileName);
  const order = data.purchase_orders.find((o) => o.po_number === id);
  res.json(order || { message: "Purchase order not found" });
});

// Create a new purchase order
router.post("/orders",authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  const newOrder = req.body;
  data.purchase_orders.push(newOrder);
  await writeJSON(fileName, data);
  res.status(201).json({ message: "Purchase order created", order: newOrder });
});

export default router;
