const express = require('express');
const router = express.Router();
const path = require('path');

const auth = require('./auth');
const users = require('./users');
const properties = require('./properties');
const locations = require('./locations');


// API routes
router.use('/api/auth', auth);
router.use('/api/users', users);
router.use('/api/properties', properties);
router.use('/api/locations', locations);

// index
router.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});


module.exports = router;
