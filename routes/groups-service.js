'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Groups = function () {
};

Groups.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('groups');

        callback(err, database);
    });
};

Groups.prototype.add = function (group, callback) {
    return db.insert(group, callback);
};

Groups.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Groups.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Groups.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Groups.prototype.update = function (_id, updatedGroup, callback) {
    delete updatedGroup._id;
    return db.update({_id: ObjectId(_id)}, updatedGroup, {}, callback);
};


Groups.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Groups();