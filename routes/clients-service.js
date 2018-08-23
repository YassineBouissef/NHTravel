'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Clients = function () {
};

Clients.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('nhtravel').collection('clients');

        callback(err, database);
    });
};

Clients.prototype.add = function (client, callback) {
    return db.insert(client, callback);
};

Clients.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Clients.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Clients.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Clients.prototype.update = function (_id, updatedClient, callback) {
    delete updatedClient._id;
    return db.update({_id: ObjectId(_id)}, updatedClient, {}, callback);
};


Clients.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Clients();