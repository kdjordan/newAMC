const Home = require('../models/Home');

exports.register = async function(req, res) {
    try {
        let newHome = new Home(req.body);
        if(newHome.register()){
            req.flash('adminTitleMessage', "home added successfully");
            req.session.save(function() {
                res.redirect('/admin');
            });
        } else {
            req.flash('adminTitleMessage', "Uh OH - That didn't work !");
            req.session.save(function() {
                res.redirect('/admin');
            })
        }

    } catch(e) {
        res.render('404', e);
    }
};


exports.getHomeDataById = async function(req, res) {
    try {
        let home = await Home.getHomeData(req.body.homeId);
        res.json(home);
    } catch (e) {
        res.send(e);
    }
} 

