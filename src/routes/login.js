const express = require('express');
const LoginController = require('../controllers/LoginController');

const router = express.Router();

router.get('/login', LoginController.login);
router.post('/login', LoginController.authUser);//Autenticaión
//router.post('/usuario', LoginController.authUser);//Autenticaión
router.get('/register', LoginController.register);//Registrar
router.post('/register',LoginController.storeUser);//Registrar en BD
router.get('/logout', LoginController.logout);//Salir

module.exports = router;