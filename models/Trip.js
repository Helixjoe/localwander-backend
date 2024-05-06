const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: String,
  location: String,
  startDate: Date,
  endDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration: Number,
});

module.exports = mongoose.model("Trip", tripSchema);
