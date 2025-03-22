import Log from "../model/log_model.js";

// Create a new log entry
export const createLog = async (req, res) => {
  try {
    const { timestamp, user_id, category, event, details } = req.body;
    const log = new Log({
      timestamp: timestamp || Date.now(),
      user_id,
      category,
      event,
      details,
    });
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).json({ error: error.message });
  }
};
