const Reservation = require('../models/Reservation');


exports.create = function(req, res) {
    
    let reservation = new Reservation(req.body, req.session.user._id);
    
    
    reservation.create().then((result) => {
        res.send('reservation made');
    }).catch((e) => {
        res.send(e)
    })
}