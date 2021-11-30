const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});
let User;

module.exports = {

    initialize: function() {
        return new Promise((resolve, reject) => {

            let db = mongoose.createConnection("mongodb+srv://maxratajczak:maxratajczak48@senecaweb.lsz5b.mongodb.net/web322_assignment?retryWrites=true&w=majority");
            db.on('error', (err)=>{
                reject(err);
            });    
            db.once('open', ()=>{
                User = db.model("users", userSchema);
                resolve();
            });

        });
    },

    registerUser: function(userData) {
        return new Promise((resolve, reject) => {

            if(userData.password != userData.password2) {
                reject("Passwords do not match")
            }
            else {
                bcrypt.genSalt(10)
                .then(salt => bcrypt.hash(userData.password, salt))
                .then((hash) => {
                    let newUser = new User(userData);
                    newUser.password = hash;
                    newUser.save((err) => {
                        if(err && err.code && err.code === 11000) {
                            reject("User name is already taken.")
                        }
                        else if(err && err.code && err.code != 11000) {
                            reject(`There was an error creating the user: ${err}`);
                        }
                        else {
                            resolve();
                        }
                    });
                })
                .catch((err) => {
                    reject("There was an error encrypting the password.");
                })


            }

        });
    },

    checkUser: function(userData) {
        return new Promise((resolve, reject) => {
            User.find({userName: userData.userName})
            .exec()
            .then((users) => {
                var data = users.map(value => value.toObject());
                var matched = false;
                bcrypt.compare(userData.password, data[0].password).then((result) => {
                    if(!result) {
                        reject(`Incorrect password for user: ${userData.userName}`);
                    }
                });

                if(data.length === 0) {
                    reject(`Unable to find user: ${userData.userName}`);
                }
                else {
                    var login = {
                        dateTime: (new Date()),
                        userAgent: userData.userAgent
                    }
                    data[0].loginHistory.push(login);

                    User.updateOne({userName: data[0].userName}, {$set: {loginHistory: data[0].loginHistory}})
                    .exec()
                    .then(() => {
                        resolve(data[0]);
                    })
                    .catch((err) => {
                        reject(`There was an error verifying the user: ${err}`);
                    });
                }
            })
            .catch((err) => {
                reject(`Unable to find user: ${userData.userName}`);
            });

        });
    },



}