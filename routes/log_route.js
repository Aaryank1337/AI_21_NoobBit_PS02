import express from "express";
import { createLog, getAllLogs } from "../controller/log_controller.js";

const router = express.Router();

// Route to create a new log entry
router.post('/', createLog);

// Route to get all logs
router.get('/', getAllLogs);

export default router;
