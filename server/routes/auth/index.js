const router = require('express').Router();
const controller = require('./auth.controller');
const wrap = require('express-async-wrap');

router.post('/login', wrap(controller.login));

module.exports = router;
