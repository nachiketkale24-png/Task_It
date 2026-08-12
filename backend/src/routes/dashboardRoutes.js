const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardData } = require('../controllers/dashboardController');

// All dashboard routes are protected
router.use(protect);

router.get('/stats', getDashboardData);

module.exports = router;
