const mongoose = require('mongoose');

const CouponRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: String,
  employeeId: String,
  program: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  vegPlateRate: { type: Number, required: true },
  nonVegPlateRate: { type: Number, required: true },
  vegCoupons: { type: Number, default: 0 },
  nonVegCoupons: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Ticket', CouponRequestSchema);