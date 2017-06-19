const router = require('express').Router();
const controller = require('./locations.controller');
const wrap = require('express-async-wrap');

router.get('/guList', wrap(controller.guList));

router.get('/dongList/:guId', wrap(controller.dongListByGuId));

module.exports = router;
