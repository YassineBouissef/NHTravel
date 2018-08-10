'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Materials = function () {
};

Materials.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('materials');

        callback(err, database);
    });
};

Materials.prototype.add = function (material, callback) {
    return db.insert(material, callback);
};

Materials.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Materials.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Materials.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Materials.prototype.update = function (_id, updatedMaterial, callback) {
    delete updatedMaterial._id;
    return db.update({_id: ObjectId(_id)}, updatedMaterial, {}, callback);
};


Materials.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Materials();