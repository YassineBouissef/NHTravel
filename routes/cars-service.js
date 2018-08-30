'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Cars = function () {
};

Cars.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('nhtravel').collection('cars');

        callback(err, database);
    });
};

Cars.prototype.add = function (car, callback) {
    return db.insert(car, callback);
};

Cars.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Cars.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Cars.prototype.queryName = function (name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Cars.prototype.update = function (_id, updatedCAr, callback) {
    delete updatedCar._id;
    return db.update({_id: ObjectId(_id)}, updatedCar, {}, callback);
};


Cars.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Cars();