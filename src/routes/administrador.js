const express = require('express');
const AdminController = require('../controllers/AdminController');


const router = express.Router();

router.get('/homeAdmin', AdminController.homeAdmin); //Mostrar el home
router.get('/empresa', AdminController.empresa); //Ir a empresas
//router.post('/empresa', AdminController.storeCompany); //
router.get('/reglasadmin', AdminController.reglasadmin); //Ir a las reglas
router.post('/empresas', AdminController.storeCompany); //Guardar en BD las empresas
router.post('/empresas/destroy', AdminController.destroyCompany);//eliminar empresa
router.get('/ataque', AdminController.ataque); //Ir a ataques
router.post('/ataques', AdminController.storeAttacks); //Guardar en BD los ataques
router.post('/ataques/destroy', AdminController.destroyattacks);//eliminar ataques
module.exports = router;