const Home = require('../models/Home');

exports.register = async function(req, res) {
    let newHome = new Home(req.body);
    await newHome.register().then(() => {
        res.render('admin-register', {adminMessage: "Home Succesfully added"});
    }).catch((e) => {
        res.send('problem registering home    ' + e);
    });
};


