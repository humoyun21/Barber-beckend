const mongoose = require("mongoose");

const Booking = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
  },
  service: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  ],
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Booking", Booking);
