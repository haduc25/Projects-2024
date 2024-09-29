const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/dangky', authController.register);
router.post('/dangnhap', authController.login);

module.exports = router;
