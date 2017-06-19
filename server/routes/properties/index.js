const router = require('express').Router();
const controller = require('./properties.controller');
const wrap = require('express-async-wrap');
const authMiddleware = require('../../middlewares/jwt-auth.middleware');

router.use('*', authMiddleware());

router.get('/page', wrap(controller.propertiesPage));

router.get('/:id', wrap(controller.propertyDetail));

router.post('/:id/remove', wrap(controller.removeProperty));

router.post('/', wrap(controller.saveProperty));

module.exports = router;
