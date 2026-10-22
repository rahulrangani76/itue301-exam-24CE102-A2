const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  phone: { type: String, required: [true, 'Phone is required'], trim: true },
  licenseNumber: { type: String, required: [true, 'License number is required'], unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'fleetManager', 'admin'], default: 'customer' }
}, { timestamps: true });
module.exports = mongoose.model('Customer', customerSchema);
