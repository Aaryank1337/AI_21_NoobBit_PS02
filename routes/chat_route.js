import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import {
  findFromKnowledgeBase,
  getLLMResponse,
  determineIntent,
} from "../controller/chatbot_controller.js";

dotenv.config();

const router = express.Router();

router.post("/query", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const intent = determineIntent(message);
    console.log("Determined intent:", intent);

    let responseText = "";
    let source = "";

    if (intent === "sales_module") {
      try {
        const erpResponse = await axios.get(
          "http://localhost:5000/api/sales/orders",
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        if (message.toLowerCase().includes("all")) {
          responseText =
            Array.isArray(erpResponse.data) && erpResponse.data.length > 0
              ? erpResponse.data
                  .map((order) => `Order ${order.so_number}: ${order.status}`)
                  .join("\n")
              : "No sales orders found in ERP.";
        } else {
          if (Array.isArray(erpResponse.data) && erpResponse.data.length > 0) {
            const latestOrder = erpResponse.data[0];
            responseText = `Latest Sales Order: ${latestOrder.so_number} is ${latestOrder.status}.`;
          } else {
            responseText = "No sales orders found in ERP.";
          }
        }
        source = "erp";
      } catch (erpError) {
        console.error(
          "ERP API error (sales):",
          erpError.response?.data || erpError.message
        );
        responseText = "Error fetching ERP sales data.";
        source = "erp";
      }
      return res.json({ response: responseText, source });
    } else if (intent === "purchase_module") {
      try {
        const erpResponse = await axios.get(
          "http://localhost:5000/api/purchase/orders",
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        // Similar logic for "all" or latest purchase order
        if (message.toLowerCase().includes("all")) {
          responseText =
            Array.isArray(erpResponse.data) && erpResponse.data.length > 0
              ? erpResponse.data
                  .map((order) => `PO ${order.po_number}: ${order.status}`)
                  .join("\n")
              : "No purchase orders found in ERP.";
        } else {
          if (Array.isArray(erpResponse.data) && erpResponse.data.length > 0) {
            const latestPO = erpResponse.data[0];
            responseText = `Latest Purchase Order: ${latestPO.po_number} is ${latestPO.status}.`;
          } else {
            responseText = "No purchase orders found in ERP.";
          }
        }
        source = "erp";
      } catch (erpError) {
        console.error(
          "ERP API error (purchase):",
          erpError.response?.data || erpError.message
        );
        responseText = "Error fetching ERP purchase data.";
        source = "erp";
      }
      return res.json({ response: responseText, source });
    } else if (intent === "stores_module") {
      try {
        const erpResponse = await axios.get(
          "http://localhost:5000/api/stores/inventory",
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        // Return full inventory or specific stock details based on keywords.
        responseText =
          Array.isArray(erpResponse.data) && erpResponse.data.length > 0
            ? erpResponse.data
                .map(
                  (item) =>
                    `SKU ${item.sku}: ${item.quantity} units in ${item.stock_location}`
                )
                .join("\n")
            : "No inventory data found.";
        source = "erp";
      } catch (erpError) {
        console.error(
          "ERP API error (stores):",
          erpError.response?.data || erpError.message
        );
        responseText = "Error fetching ERP inventory data.";
        source = "erp";
      }
      return res.json({ response: responseText, source });
    } else if (intent === "production_module") {
      try {
        const erpResponse = await axios.get(
          "http://localhost:5000/api/production/batches",
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        responseText =
          Array.isArray(erpResponse.data) && erpResponse.data.length > 0
            ? erpResponse.data
                .map((batch) => `Batch ${batch.batch_number}: ${batch.status}`)
                .join("\n")
            : "No production batches found.";
        source = "erp";
      } catch (erpError) {
        console.error(
          "ERP API error (production):",
          erpError.response?.data || erpError.message
        );
        responseText = "Error fetching ERP production data.";
        source = "erp";
      }
      return res.json({ response: responseText, source });
    } else if (intent === "quality_module") {
      try {
        const erpResponse = await axios.get(
          "http://localhost:5000/api/quality/inspections",
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        responseText =
          Array.isArray(erpResponse.data) && erpResponse.data.length > 0
            ? erpResponse.data
                .map((ins) => `Inspection ${ins.inspection_id}: ${ins.status}`)
                .join("\n")
            : "No quality inspections found.";
        source = "erp";
      } catch (erpError) {
        console.error(
          "ERP API error (quality):",
          erpError.response?.data || erpError.message
        );
        responseText = "Error fetching ERP quality data.";
        source = "erp";
      }
      return res.json({ response: responseText, source });
    } else if (intent === "dispatch_module") {
      try {
        const erpResponse = await axios.get(
          "http://localhost:5000/api/dispatch/shipments",
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        responseText =
          Array.isArray(erpResponse.data) && erpResponse.data.length > 0
            ? erpResponse.data
                .map((ship) => `Shipment ${ship.dispatch_id}: ${ship.status}`)
                .join("\n")
            : "No dispatch information found.";
        source = "erp";
      } catch (erpError) {
        console.error(
          "ERP API error (dispatch):",
          erpError.response?.data || erpError.message
        );
        responseText = "Error fetching ERP dispatch data.";
        source = "erp";
      }
      return res.json({ response: responseText, source });
    } else {
      // Non-ERP related queries: fallback to FAQ/LLM.
      const knowledgeResponse = await findFromKnowledgeBase(message);
      if (knowledgeResponse) {
        return res.json({
          response: knowledgeResponse,
          source: "knowledge_base",
        });
      }
      const llmResponse = await getLLMResponse(message);
      return res.json({ response: llmResponse, source: "llm" });
    }
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
});

export default router;
