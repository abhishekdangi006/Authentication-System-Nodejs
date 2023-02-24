const express = require('express');
const router = express.Router();

const controller = require("../controller/home_controller");

router.get('/', controller.home);
router.use('/users', require('./users'));
router.use('/post', require('./post'));
router.use('/comment', require('./comment'));
router.use('/likes', require('./likes'));

router.use('/api', require('./api'));


module.exports = router;