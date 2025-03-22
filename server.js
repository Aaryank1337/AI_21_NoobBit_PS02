import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import chatRoutes from "./routes/chat_route.js";
import salesRoutes from "./routes/sales_routes.js"
import purchaseRoutes from "./routes/purchase_routes.js";
import storesRoutes from "./routes/stores_routes.js";
import productionRoutes from "./routes/production_routes.js";
import qualityRoutes from "./routes/quality_routes.js";
import dispatchRoutes from "./routes/dispatch_routes.js";
import { issueToken } from "./middleware/authMiddleware.js";
import whatsappRoutes from "./routes/whatsapp_routes.js"


// Initialize Express app
const app = express();
app.use(express.urlencoded({ extended: true })); // Required for Twilio
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

// Routes
app.use("/api", chatRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/quality", qualityRoutes);
app.use("/api/dispatch", dispatchRoutes);

// OAuth2 Token Issuance (For Testing)
app.get("/auth/token", issueToken);


app.use("/api", whatsappRoutes);

