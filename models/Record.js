const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  country: { type: String, required: true },

  // Timestamp when this aggregated record was created
  timestamp: { type: Date, default: Date.now },

  // COVID Data (entire object)
  covid: {
    type: Object,
    required: true
  },

  // Travel Data (entire object)
  travel: {
    type: Object,
    required: true
  },

  // Optional: Store full original JSON for debugging or auditing
  raw: {
    type: Object,
    default: {}
  },

  // Saved-at time
  dateFetched: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Record", recordSchema);
