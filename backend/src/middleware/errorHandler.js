function errorHandler(error, _req, res, _next) {
  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map(item => item.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (error.code === 11000) return res.status(400).json({ error: 'A record with that unique value already exists.' });
  const status = error.status || 500;
  if (status >= 500) console.error('[DriveEasy API error]', error);
  res.status(status).json({ error: status === 500 ? 'An unexpected server error occurred.' : error.message });
}
module.exports = errorHandler;
