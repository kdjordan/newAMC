const homesCollection = require('../db').db().collection('homes');
const ObjectID = require('mongodb').ObjectID;


let Home = function(data) {
    this.data = data;
    this.errors = [];
}

Home.prototype.cleanUp = function() {
    if(typeof(this.data.homeUrl) != 'string') {this.data.homeUrl = '';}
    if(typeof(this.data.homeName) != 'string') {this.data.homeName = '';}

    this.data = {
        homeUrl: this.data.homeUrl.trim().toLowerCase(),
        homeName: this.data.homeName.trim().toLowerCase()
    }
}

Home.prototype.register = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        if(!this.errors.length) {
            homesCollection.insertOne(this.data).then(() => {
                resolve();
            }).catch((e) => {
                reject(e)
            });
        } else {
            reject('Please try again Later');
        }
    })
    
}

Home.getHomeData = function(id) {
    return new Promise(async (resolve, reject) => {
        if(typeof(id) != 'string' || !ObjectID.isValid(id)) {
            reject();
            return;
         }
         let homeDoc = await homesCollection.aggregate(
            [{$match: {_id: new ObjectID(id)}},
              {$project: {
                  homeUrl: 1,
                  homeName: 1
              }
          }]).toArray();
          
          if(homeDoc.length) {
              resolve(homeDoc[0]);
          } else {
              reject('error');
          }
    })
}

Home.delete = function(id) {
    return new Promise(async (resolve, reject) => {
        if(ObjectID.isValid(id)) {
            console.log('deleting from model')
            let message = await homesCollection.deleteOne({_id: new ObjectID(id)});
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

module.exports = Home;