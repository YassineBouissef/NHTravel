'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Anomalies = function () {
};

Anomalies.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('anomalies');

        callback(err, database);
    });
};

Anomalies.prototype.add = function (anomalies, callback) {
    return db.insert(anomalies, callback);
};

Anomalies.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Anomalies.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Anomalies.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Anomalies.prototype.update = function (_id, updatedAnomaly, callback) {
    delete updatedAnomaly._id;
    return db.update({_id: ObjectId(_id)}, updatedAnomaly, {}, callback);
};


Anomalies.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Anomalies();