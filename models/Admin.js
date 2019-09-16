const usersCollection = require('../db').db().collection('users');
const homesCollection = require('../db').db().collection('homes');
const keepersCollection = require('../db').db().collection('keepers');
const User = require('../models/User');

let Admin = function() {
    this.users = [];
    // this.homes = [];
    // this.keepers = [];
    // this.errors = [];
};



Admin.prototype.getMenuData = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let usersDoc = await usersCollection.find().toArray();
            usersDoc.forEach((user) => {
                this.users.push({username: user.username, _id: user._id});
            });
            resolve(this.users);
        } catch (e) {
            reject(e);
        }
    })
    
};


module.exports = Admin;