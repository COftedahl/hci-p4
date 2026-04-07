import mongoose from "mongoose";

const SessionLogSchema = new mongoose.Schema(
  {
    logs: {
      type: [{
        timestamp: {type: String, require: true}, 
        interactionTarget: {type: String, require: true},
      }], 
      require: true, 
    }, 
  }
)

const SessionLog = mongoose.model("SessionLog", SessionLogSchema, "user-interaction-logs");

export default SessionLog;