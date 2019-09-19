const User = require('../models/User');


exports.home = function(req, res) {
        if(req.session.user) {
            //get reservations for all applicable homes -> session data needs to include that
            res.render('home-logged-in', {username: req.session.user.username});
        } else {
            res.render('home-not-logged-in', {logInError: req.flash('logInError')});
        }
};

exports.login = function(req, res) {
        let user = new User(req.body);
        user.login().then(function(result) {
            req.session.user = {username: user.data.username, _id: user.data._id, role: user.data.role, homesArr: user.data.homesArr};
            req.session.save(function() {
                res.redirect('/');
            });
        }).catch(function(e) {
            req.flash('logInError', e);
            req.session.save(function() {
                res.redirect('/');
            })
        });    
};

exports.logout = function(req, res) {
    req.session.destroy(function(){
        res.redirect('/');
    });
};


exports.register = async function(req, res) {
    try {
        let user = new User(req.body);
        if(user.register()) {
            req.session.adminTitleMessage = "user successfully added";
            req.session.save(function() {
                res.redirect('/admin');
            })
           
        }

    } catch {
        res.send('Error adding new User');
    }
};



