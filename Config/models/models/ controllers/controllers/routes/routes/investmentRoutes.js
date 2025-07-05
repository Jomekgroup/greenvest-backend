const express = require('express');
const { createInvestment, getInvestments } = require('../controllers/investmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/invest', authMiddleware, createInvestment);
router.get('/investments', authMiddleware, getInvestments);

module.exports = router;
