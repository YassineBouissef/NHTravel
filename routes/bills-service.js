'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Bills = function () {
};

Bills.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('bills');

        callback(err, database);
    });
};

Bills.prototype.add = function (bill, callback) {
    return db.insert(bill, callback);
};

Bills.prototype.getByType = function (type, callback) {
    return db.find({tipo: +type}).toArray(callback);
};

Bills.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Bills.prototype.getClientBills = function (_id, callback) {
    return db.find({"cliente._id": _id + ""}).toArray(callback);
};

Bills.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Bills.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Bills.prototype.update = function (_id, updatedBill, callback) {
    delete updatedBill._id;
    return db.update({_id: ObjectId(_id)}, updatedBill, {}, callback);
};

Bills.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Bills();