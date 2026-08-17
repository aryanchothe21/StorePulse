const express = require('express');
const router = express.Router();
const { submitRating } = require('../controllers/ratingController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.post('/', submitRating);

module.exports = router;