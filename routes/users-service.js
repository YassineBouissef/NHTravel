'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Users = function () {
};

Users.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('nhtravel').collection('users');

        callback(err, database);
    });
};

Users.prototype.findById = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Users.prototype.findByUsername = function (username, callback) {
    return db.find({username: username}).toArray(callback);
};

module.exports = new Users();