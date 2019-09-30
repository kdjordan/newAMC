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

router.post('/admin/registerUsers', adminController.isAdmin, userController.register);
router.post('/admin/user/:id/delete', adminController.isAdmin, userController.delete);
router.post('/admin/user/:id/update', adminController.isAdmin, userController.update);
router.post('/admin/registerHomes', adminController.isAdmin, homeController.register);
router.post('/admin/registerKeepers', adminController.isAdmin, userController.registerKeeper);


//edit related routes
router.post('/getUserData', adminController.isAdmin, userController.getUserDataById)



module.exports  = router;