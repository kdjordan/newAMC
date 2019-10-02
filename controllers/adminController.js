//require admin 
const Admin = require('../models/Admin');


exports.home = async function(req, res) {
    
   res.render('admin-register', {
       adminName: req.session.user.username,
       usersArr: req.usersArr, 
       homesArr: req.homesArr, 
       keepersArr: req.keepersArr,
       adminTitleMessage: req.flash('adminTitleMessage')
    });
}


exports.getMenuData = async function(req, res, next) {
    let admin = new Admin();
    let usersArrPromise = admin.getUsersData();
    let homesArrPromise = admin.getHomesData();  
    let keepersArrPromise = admin.getKeepersData();
    
    let [usersArr, homesArr, keepersArr] = await Promise.all([usersArrPromise, homesArrPromise, keepersArrPromise]);
    req.usersArr = usersArr;
    req.homesArr = homesArr;
    req.keepersArr = keepersArr;
    
    
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


