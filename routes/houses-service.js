'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Houses = function () {
};

Houses.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('houses');

        callback(err, database);
    });
};

Houses.prototype.add = function (house, callback) {
    return db.insert(house, callback);
};

Houses.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Houses.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Houses.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Houses.prototype.update = function (_id, updatedHouse, callback) {
    delete updatedHouse._id;
    return db.update({_id: ObjectId(_id)}, updatedHouse, {}, callback);
};


Houses.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Houses();