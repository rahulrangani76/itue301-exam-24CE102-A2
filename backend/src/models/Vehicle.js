const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  model: { type: String, required: [true, 'Vehicle model is required'], trim: true },
  type: { type: String, required: [true, 'Vehicle type is required'], enum: ['Hatchback', 'Sedan', 'SUV'] },
  pricePerDay: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  available: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Vehicle', vehicleSchema);
