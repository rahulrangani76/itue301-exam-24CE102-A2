const router = require('express').Router();
const { authGuard, allowRoles } = require('../middleware/authGuard');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
router.use(authGuard, allowRoles('admin', 'fleetManager'));
router.get('/summary', async (_req, res, next) => {
  try {
    const [vehicles, bookings, available] = await Promise.all([Vehicle.countDocuments(), Booking.countDocuments(), Vehicle.countDocuments({ available: true })]);
    res.json({ vehicles, bookings, available, reserved: vehicles - available });
  } catch (error) { next(error); }
});
module.exports = router;
