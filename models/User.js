const usersCollection = require('../db').db().collection('users');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const md5 = require('md5');
const ObjectID = require('mongodb').ObjectID;


let User = function(data) {
    this.data = data;
    this.errors = [];
}

User.prototype.cleanUp = function(loginFlag) {
    if(typeof(this.data.username) != 'string') {this.data.username = '';}
    if(typeof(this.data.password) != 'string') {this.data.password = '';}
    

    if (loginFlag) {
        this.data = {
            username: this.data.username.trim().toLowerCase(),
            password: this.data.password,
        }
    } else {
        if(typeof(this.data.role) != 'string') {this.data.role = '';}
        if(!Array.isArray(this.data.checkBoxHomesArr)) {
            if(typeof(this.data.checkBoxHomesArr) != 'string') {
                this.data.checkBoxhomesArr = '';
            } else {
                this.data.checkBoxHomesArr = [this.data.checkBoxHomesArr];
            }
        }
        this.data = {
            username: this.data.username.trim().toLowerCase(),
            password: this.data.password,
            homesArray:  this.data.checkBoxHomesArr,
            role:  this.data.role.trim().toLowerCase()
        }
    }

    
}

User.prototype.validate = function() {
    if(this.data.username == '') {this.errors.push('You must provide a username');}
    if(this.data.password == '') {this.errors.push('You must provide a password');}
    if(this.data.username.length > 50) {this.errors.push('Your username is too long');}
    if(this.data.password.length > 50) {this.errors.push('Your password is too long');}
}

User.prototype.register = function () {
    return new Promise((resolve, reject) => {
        
            this.cleanUp(false);
            // this.validate();
            if(!this.errors.length) {
                //hash user password
                let salt = bcrypt.genSaltSync(10);
                this.data.password = bcrypt.hashSync(this.data.password, salt);
                //insert use data into db
                usersCollection.insertOne(this.data).then(() => {
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
               
            } else {
                reject();
            }
    }) 
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp(true);
        this.validate();
        
        if(!this.errors.length) {
            usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
                if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                    this.data = attemptedUser;
                    resolve('success');
                } else {
                    reject('Invalid Username / Password');
                }
            }).catch((e) => {
                reject('Please try again later' + e);
            })
        }
    })
};

User.getUserData = function(id) {
    return new Promise(async (resolve, reject) => {
            if(typeof(id) != 'string' || !ObjectID.isValid(id)) {
                reject();
                return;
             }
             try {
                 let userDoc = await usersCollection.aggregate(
                   [{$match: {_id: new ObjectID(id)}},
                     {$project: {
                         username: 1,
                         homesArray: 1,
                         role: 1
                     }
                 }]).toArray();

                 if(userDoc.length) {
                    resolve(userDoc[0]);
                }

             } catch(e) {
                 reject(e);
             }

    })
}

User.delete = function(id) {
    return new Promise(async (resolve, reject) => {
        if(ObjectID.isValid(id)) {
            let message = await usersCollection.deleteOne({_id: new ObjectID(id)});
            if(message) {
                resolve('success');
            } else {
                reject('error')
            }
        } else {
            reject();
        }
    });
};


User.update = function(data) {
    return new Promise(async (resolve, reject) => {
        // this.cleanUp(false);
        let setObject = {};
        if(data.password == 0){
            setObject = {
                    username: data.username,
                    homesArray: data.checkBoxHomesArr,
                    role: data.role 
            }
        } else {
            let salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
            setObject = {
                    username: data.username,
                    password: data.password,
                    homesArray: data.checkBoxHomesArr,
                    role: data.role 
            }
        }
        
        let userDoc = await usersCollection.updateOne(
            {_id: new ObjectID(data.id)},
            {$set: setObject}
             
        )
        if(userDoc) {
            resolve('success');
        } else {
            reject('error')
        }
    })        
}




// User.prototype.update = function(data, id) {

//             let userDoc = await usersCollection.findOneAndUpdate(
//                 {_id: new ObjectID(id.id)},
//                 {$set: {username: data.username,
//                         password: data.password,
//                         homesArray: data.checkBoxHomesArr,
//                         role: data.roles
//                         }     
//                 }
//             )
//          if(userDoc) {
//              resolve('success');
//          } else {
//              reject('error')
//          }
// };

module.exports = User;
