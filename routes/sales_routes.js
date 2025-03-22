import express from "express";
import { readJSON, writeJSON } from "../src/lib/jsonHelper.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
const fileName = "sales.json";



// Get all sales orders (secured)
router.get("/orders", authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  res.json(data.sales_orders || []);
});

// Get specific sales order (secured)
router.get("/orders/:so_number", authenticateToken, async (req, res) => {
  const { so_number } = req.params;
  const data = await readJSON(fileName);
  const order = data.sales_orders.find((o) => o.so_number === so_number);
  res.json(order || { message: "Order not found" });
});

// Create new sales order (secured)
router.post("/orders", authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  const newOrder = req.body;
  data.sales_orders.push(newOrder);
  await writeJSON(fileName, data);
  res.status(201).json({ message: "Sales order created", order: newOrder });
});

export default router;
