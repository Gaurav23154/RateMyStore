const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { registerValidation, passwordUpdateValidation } = require('../middleware/validators');

router.post('/register', registerValidation, register);
router.post('/login', login);
router.put('/password', auth, passwordUpdateValidation, updatePassword);

module.exports = router; 