const express = require('express');
const { register, login, getDashboard } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', authMiddleware, getDashboard);

module.exports = router;
