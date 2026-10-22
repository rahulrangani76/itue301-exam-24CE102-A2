const router = require('express').Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { authGuard, allowRoles } = require('../middleware/authGuard');
router.use(authGuard);

router.post('/', async (req, res, next) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;
    if (!mongoose.isValidObjectId(vehicleId) || !pickupDate || !returnDate) return res.status(400).json({ error: 'Choose a vehicle and provide pickup and return dates.' });
    const pickup = new Date(pickupDate), dropoff = new Date(returnDate);
    if (Number.isNaN(+pickup) || Number.isNaN(+dropoff) || dropoff <= pickup) return res.status(400).json({ error: 'Return date must be later than pickup date.' });
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(400).json({ error: 'Vehicle was not found.' });
    if (!vehicle.available) return res.status(400).json({ error: 'This vehicle is already reserved and unavailable.' });
    const booking = await Booking.create({ customerId: req.user.id, vehicleId, pickupDate: pickup, returnDate: dropoff });
    vehicle.available = false;
    await vehicle.save();
    res.status(201).json({ message: 'Booking reserved successfully.', booking });
  } catch (error) { next(error); }
});
router.get('/my', async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('customerId', 'name email').populate('vehicleId', 'model type').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) { next(error); }
});
router.patch('/:id/status', allowRoles('admin', 'fleetManager'), async (req, res, next) => {
  try {
    const allowed = ['reserved', 'ongoing', 'completed', 'cancelled'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}.` });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    const wasActive = ['reserved', 'ongoing'].includes(booking.status);
    booking.status = req.body.status;
    await booking.save();
    if (wasActive && ['completed', 'cancelled'].includes(booking.status)) await Vehicle.findByIdAndUpdate(booking.vehicleId, { available: true });
    if (['reserved', 'ongoing'].includes(booking.status)) await Vehicle.findByIdAndUpdate(booking.vehicleId, { available: false });
    res.json({ message: 'Booking status updated.', booking });
  } catch (error) { next(error); }
});
module.exports = router;
