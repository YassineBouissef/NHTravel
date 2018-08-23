'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Checks = function () {
};

Checks.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('checks');

        callback(err, database);
    });
};

Checks.prototype.add = function (check, callback) {
    return db.insert(check, callback);
};

Checks.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Checks.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Checks.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Checks.prototype.update = function (_id, updatedCheck, callback) {
    delete updatedCheck._id;
    return db.update({_id: ObjectId(_id)}, updatedCheck, {}, callback);
};


Checks.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Checks();