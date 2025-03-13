const express = require('express');
const ClientController = require('../controllers/ClientController');

const router = express.Router();

router.get('/homeClient', ClientController.homeClient);
router.get('/reglasclient', ClientController.reglasclient);
router.get('/alertas', ClientController.alertas);
router.get('/trafico', ClientController.trafico);
router.get('/dispositivo', ClientController.dispositivo);

module.exports = router;