const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/signup', signup);

router.post('/login', login);


router.patch('/update-password', verifyToken, updatePassword);

module.exports = router;
