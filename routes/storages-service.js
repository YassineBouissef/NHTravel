'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Storages = function () {
};

Storages.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('storages');

        callback(err, database);
    });
};

Storages.prototype.add = function (storage, callback) {
    return db.insert(storage, callback);
};

Storages.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Storages.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Storages.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Storages.prototype.update = function (_id, updatedStorage, callback) {
    delete updatedStorage._id;
    return db.update({_id: ObjectId(_id)}, updatedStorage, {}, callback);
};


Storages.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Storages();