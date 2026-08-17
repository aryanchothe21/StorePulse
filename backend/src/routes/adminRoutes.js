const express = require('express');
const router = express.Router();
const {
  getDashboard,
  createUser,
  createStore,
  listUsers,
  listStores,
  getUserDetail,
} = require('../controllers/adminController');
const verifyToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');


router.use(verifyToken, checkRole('ADMIN'));


router.get('/dashboard', getDashboard);

router.post('/users', createUser);


router.get('/users', listUsers);

router.get('/users/:id', getUserDetail);


router.get('/stores', listStores);


router.post('/stores', createStore);

module.exports = router;
