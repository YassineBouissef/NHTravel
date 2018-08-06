'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Providers = function () {
};

Providers.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('providers');

        callback(err, database);
    });
};

Providers.prototype.add = function (provider, callback) {
    return db.insert(provider, callback);
};

Providers.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Providers.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Providers.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Providers.prototype.update = function (_id, updatedProvider, callback) {
    delete updatedProvider._id;
    return db.update({_id: ObjectId(_id)}, updatedProvider, {}, callback);
};


Providers.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Providers();