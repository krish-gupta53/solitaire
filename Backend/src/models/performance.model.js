import mongoose,{Schema} from "mongoose";

const performanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    type: String, // Cognitive test type
    score: Number,
    responseTimes: [Number], // For reaction time tests
    correctResponses: Number, // For attention/memory tests
    dateTaken: { type: Date, default: Date.now },
  });
  module.exports = mongoose.model('Performance', performanceSchema);