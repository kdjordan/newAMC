const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const reservationController = require('./controllers/reservationController');
const adminController = require('./controllers/adminController');
const homeController = require('./controllers/homeController');


router.get('/', userController.home);

router.get('/logout', userController.logout);
router.post('/login', userController.login)

router.post('/makeReservation', reservationController.create);


//admin realated routes
router.get('/admin', adminController.isAdmin, adminController.getMenuData, adminController.home);

router.post('/admin/registerUser', adminController.isAdmin, userController.register);
router.post('/admin/user/:id/delete', adminController.isAdmin, userController.delete);
router.post('/admin/registerHome', adminController.isAdmin, homeController.register);


//edit related routes
router.post('/getUserData', adminController.isAdmin, userController.getUserDataById)



module.exports  = router;