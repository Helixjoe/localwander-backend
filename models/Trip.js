const mongoose = require("mongoose");

const travelSchema = new mongoose.Schema({
  spotName: String,
  timeToReach: Number,
  transport: String,
});

const daySchema = new mongoose.Schema({
  name: String,
  travel: [travelSchema],
  expense: Number,
});

const tripSchema = new mongoose.Schema({
  title: String,
  days: [daySchema],
  startDate: Date,
  endDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration: Number,
  expense: Number,
});

module.exports = mongoose.model("Trip", tripSchema);
