const Reservation = require('../models/Reservation');


exports.create = function(req, res) {
    
    let reservation = new Reservation(req.body, req.session.user._id);
    reservation.create().then((result) => {
        req.flash('success', 'Reservation Made !');
        req.session.save(() => {
            res.redirect('/');
        })
    }).catch((e) => {
        errors.forEach(e => req.flash('errors', e))
        req.session.save(() => {
            res.redirect('/');
        })
    })
}