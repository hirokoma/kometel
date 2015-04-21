'use strict';

var express = require('express');
var controller = require('./twilio.controller');

var router = express.Router();

router.get('/hello', controller.hello);
router.get('/register', controller.register);
router.get('/:id/order', controller.order);

module.exports = router;
