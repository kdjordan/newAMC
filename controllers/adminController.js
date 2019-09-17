//require admin 
const Admin = require('../models/Admin');


//exports.name = function(req, res) {}



exports.home = async function(req, res) {
    console.log(req.usersArr);
   res.render('admin-register', {usersArr: req.usersArr});
}


exports.getMenuData = async function(req, res, next) {
    let admin = new Admin();
    let usersArrPromise = await admin.getUsersData();
    // let homesArrPromise = admin.getHomesData();
    // let keepersArr = admin.getKeepersData();
    
    // let [usersArr] = await Promise.all([usersArrPromise);
    
    req.usersArr = usersArrPromise;
    // req.homesArr = homesArr;
    
    // console.log(req.usersArr);
    // console.log(homesArr);
    next();
}

exports.isAdmin = function(req, res, next) {
    if (req.session.user.role == 'admin') {
        next();
    } else {
        req.flash('adminErrors', "You must Be an Admin to Visit that area");
        req.session.save(function() { 
            res.render(('404'), {adminErrors: req.flash('adminErrors')})
        });
    }   
}

