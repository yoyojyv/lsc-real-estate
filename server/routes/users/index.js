const router = require('express').Router();
const controller = require('./users.controller');
const wrap = require('express-async-wrap');
const authMiddleware = require('../../middlewares/jwt-auth.middleware');

// jwt auth middleware
router.use('*', authMiddleware());

router.get('/page', wrap(controller.usersPage));

router.get('/:id', wrap(controller.userDetail));

router.post('/:id/remove', wrap(controller.removeUser));

router.post('/', wrap(controller.saveUser));


module.exports = router;
