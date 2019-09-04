const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');


router.get('/', userController.home);
router.get('/admin', userController.adminHome);
router.get('/logout', userController.logout);

router.post('/admin/register', userController.register);
router.post('/login', userController.login)

module.exports  = router;