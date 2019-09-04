const User = require('../models/User');


exports.home = function(req, res) {
    if(req.session.user) {
        
        res.render('home-logged-in', {username: req.session.user.username});
    } else {
        res.render('home-not-logged-in');
    }
    
};


exports.register = async function(req, res) {
    try {
        let user = new User(req.body);
        if(user.register()) {
            res.send('new user added');
        }

    } catch {
        res.send('Error adding new User');
    }

};

exports.login = async function(req, res) {
    try {
        let user = new User(req.body);
        await user.login(); 
        req.session.user = {username: user.data.username};
        res.redirect('/');
    } catch (e) {
        res.send(e);
    }
};

exports.adminHome = function(req, res) {
    res.render('admin-register');
}

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};