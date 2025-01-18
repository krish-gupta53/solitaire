import mongoose,{Schema} from "mongoose";

const testSchema = new mongoose.Schema({
    type: { type: String, required: true }, // "memory", "attention", etc.
    instructions: { type: String, required: true },
    config: { type: Object, required: true }, // Test-specific settings
    createdAt: { type: Date, default: Date.now },
  });
  
  
  module.exports = mongoose.model('Test', testSchema);
  