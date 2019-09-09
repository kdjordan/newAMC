const reservationsCollection = require('../db').db().collection('reservations');
const ObjectID = require('mongodb').ObjectID;
const sanitizeHTML = require('sanitize-html');

let Reservation = function(data, userid) {
    this.data = data;
    this.userid = userid;
    this.errors = [];
}

Reservation.prototype.cleanUp = function() {
    if(typeof(this.data.resDates) != 'string') {this.data.resDates = '';}
    if(typeof(this.data.guest) != 'string') {this.data.guest = '';}
    if(typeof(this.data.phone) != 'string') {this.data.phone = '';}

    this.data = {
        resDates: sanitizeHTML(this.data.resDates.trim(), {allowedTags: [], allowedAttributes: []}),
        guest: sanitizeHTML(this.data.guest.trim(), {allowedTags: [], allowedAttributes: []}),
        phone: sanitizeHTML(this.data.phone.trim(), {allowedTags: [], allowedAttributes: []}),
        createdDate: new Date(),
        author: new ObjectID(this.userid)
    }
}

Reservation.prototype.validate = function() {
    if(this.resDates == '') {this.errors.push('You must provide reservation dates');}
    if(this.phone == '') {this.errors.push('You must provide a contact phone #');}
    if(this.guest == '') {this.errors.push('You must provide a guest name.');}
} 

Reservation.prototype.create = function() {
    
        return new Promise((resolve, reject) => {
            //clean up input 
            this.cleanUp();
            this.validate();
            
            if(!this.errors.length) {
                reservationsCollection.insertOne(this.data).then((info) => {
                    resolve(info.ops[0]._id);
                }).catch(() => {
                    this.errors.push('Please try again later');
                    reject(this.errors);
                })
            } else {
                reject(this.errors);
            }
        });
}

module.exports = Reservation;
