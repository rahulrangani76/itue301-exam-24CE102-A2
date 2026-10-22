const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  status: { type: String, enum: ['reserved', 'ongoing', 'completed', 'cancelled'], default: 'reserved', required: true }
}, { timestamps: true });
bookingSchema.pre('validate', function(next) {
  if (this.pickupDate && this.returnDate && this.returnDate <= this.pickupDate) this.invalidate('returnDate', 'Return date must be after pickup date.');
  next();
});
module.exports = mongoose.model('Booking', bookingSchema);
