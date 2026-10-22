const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, licenseNumber, password } = req.body;
    if (!name || !email || !phone || !licenseNumber || !password) return res.status(400).json({ error: 'Name, email, phone, license number and password are required.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    const customer = await Customer.create({ name, email, phone, licenseNumber, passwordHash: await bcrypt.hash(password, 10) });
    const token = jwt.sign({ id: customer.id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, customer: { id: customer.id, name: customer.name, email: customer.email, role: customer.role } });
  } catch (error) { next(error); }
});
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email: String(email || '').toLowerCase() });
    if (!customer || !await bcrypt.compare(password || '', customer.passwordHash)) return res.status(401).json({ error: 'Email or password is incorrect.' });
    const token = jwt.sign({ id: customer.id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, customer: { id: customer.id, name: customer.name, email: customer.email, role: customer.role } });
  } catch (error) { next(error); }
});
module.exports = router;
