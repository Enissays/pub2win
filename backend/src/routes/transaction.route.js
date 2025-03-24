const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/admin/Transaction.controller');


// Route pour récupérer les années disponibles
router.get('/tran/years', TransactionController.getTransactionYears);

// Route pour récupérer le nombre d'utilisateurs par mois pour une année spécifique
router.get('/tran/count/:year', TransactionController.getGainsTransactionByMonth);


//total of commmision_app
router.get('/total-commission',TransactionController.getTotalCommissionApp);

module.exports = router;