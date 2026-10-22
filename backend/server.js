require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { requestLogger } = require('./src/middleware/requestLogger');
const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const Vehicle = require('./src/models/Vehicle');

const app = express();
app.use(requestLogger);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'DriveEasy API' }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use((_req, _res, next) => next(Object.assign(new Error('Route not found'), { status: 404 })));
app.use(errorHandler);

async function start() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Copy .env.example to backend/.env and configure it.');
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing. Set it in backend/.env before starting the API.');
  await mongoose.connect(process.env.MONGO_URI);
  if (await Vehicle.countDocuments() === 0) {
    await Vehicle.insertMany([
      { model: 'Maruti Swift', type: 'Hatchback', pricePerDay: 1800, available: true },
      { model: 'Honda City', type: 'Sedan', pricePerDay: 2800, available: true },
      { model: 'Hyundai Creta', type: 'SUV', pricePerDay: 3500, available: true },
      { model: 'Tata Punch', type: 'SUV', pricePerDay: 2400, available: true }
    ]);
  }
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`DriveEasy API listening on http://localhost:${port}`));
}
if (require.main === module) start().catch(error => { console.error(error.message); process.exit(1); });
module.exports = app;
