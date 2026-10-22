const router = require('express').Router();
const Vehicle = require('../models/Vehicle');
router.get('/', async (_req, res, next) => {
  try { res.json(await Vehicle.find().sort({ model: 1 })); } catch (error) { next(error); }
});
module.exports = router;
