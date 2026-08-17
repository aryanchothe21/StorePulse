const express = require('express');
const router = express.Router();
const { browseStores } = require('../controllers/storeController');
const verifyToken = require('../middlewares/authMiddleware');


router.use(verifyToken);

router.get('/', browseStores);

module.exports = router;
