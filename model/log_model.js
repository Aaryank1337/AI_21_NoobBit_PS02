import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    enum: ["Chatbot", "API"],
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Log = mongoose.model("Log", logSchema);

export default Log;
