//require admin 
const Admin = require('../models/Admin');


//exports.name = function(req, res) {}



exports.home = async function(req, res) {
    //create new Admin
    let admin = new Admin();
    
    admin.getMenuData().then((menuDoc) => {
        // console.log(menuDoc);
        res.render('admin-register', {menuDoc});
    }).catch((e) => {
        res.render('404')
    });
    
    

    
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

