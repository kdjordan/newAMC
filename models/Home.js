const homesCollection = require('../db').db().collection('homes');

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


module.exports = Home;