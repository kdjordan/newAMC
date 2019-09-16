const usersCollection = require('../db').db().collection('users');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const md5 = require('md5');


let User = function(data) {
    this.data = data;
    this.errors = [];
}

User.prototype.cleanUp = function(loginFlag) {
    if(typeof(this.data.username) != 'string') {this.data.username = '';}
    if(typeof(this.data.password) != 'string') {this.data.password = '';}
    // if(typeof(this.data.role) != 'string') {this.data.password = '';}
    // if (!this.data.homesArr.isArray()) {this.data.homesArr = [];}

    if (loginFlag) {
        this.data = {
            username: this.data.username.trim().toLowerCase(),
            password: this.data.password,
        }
    }else {
        if(typeof(this.data.role) != 'string') {this.data.password = '';}
        // if (!this.data.homesArr.isArray()) {this.data.homesArr = [];}

        this.data = {
            username: this.data.username.trim().toLowerCase(),
            password: this.data.password,
            homesArray:  this.data.homesArr,
            role:  this.data.role.trim().toLowerCase()
        }
    }

    
}

User.prototype.validate = function() {
    if(this.data.username == '') {this.data.errors.push('You must provide a username');}
    if(this.data.password == '') {this.data.errors.push('You must provide a password');}
    if(this.data.username.length > 50) {this.data.errors.push('Your username is too long');}
    if(this.data.password.length > 50) {this.data.errors.push('Your password is too long');}
}

User.prototype.register = function () {
    return new Promise((resolve, reject) => {
            this.cleanUp();
            this.validate();
            if(!this.errors.length) {
                //hash user password
                let salt = bcrypt.genSaltSync(10);
                this.data.password = bcrypt.hashSync(this.data.password, salt);
                //insert use data into db
                usersCollection.insertOne(this.data).then(() => {
                    resolve()
                }).catch((e) => {
                    reject(e)
                });
               
            } else {
                reject();
            }
    }) 
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp(true);
        if(!this.errors.length) {
            usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
                if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                    this.data = attemptedUser;
                    resolve('success');
                } else {
                    reject('Invalid Username / Password');
                }
            }).catch(() => {
                reject('Please try again later');
            })
        }
    })
};


module.exports = User;
