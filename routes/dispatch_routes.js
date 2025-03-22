import express from "express";
import { readJSON, writeJSON } from "../src/lib/jsonHelper.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
const fileName = "dispatch.json";

// Get all shipments
router.get("/shipments",authenticateToken, async (req, res) => {
  const data = await readJSON(fileName);
  res.json(data.shipments || []);
});

// Get tracking details for a specific shipment
router.get("/shipments/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = await readJSON(fileName);
  const shipment = data.shipments.find((s) => s.dispatch_id === id);
  res.json(shipment || { message: "Shipment not found" });
});

export default router;
