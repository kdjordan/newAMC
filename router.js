const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const reservationController = require('./controllers/reservationController');


router.get('/', userController.home);
router.get('/admin', userController.adminHome);
router.get('/logout', userController.logout);
router.post('/login', userController.login)

router.post('/admin/register', userController.register);
router.post('/makeReservation', reservationController.create);


module.exports  = router;