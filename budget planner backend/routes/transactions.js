const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.get('/', transactionsController.getTransactions);
router.post('/', transactionsController.addTransaction);

module.exports = router;
