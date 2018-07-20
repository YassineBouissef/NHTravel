'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectID;
const Articles = function () {
};

Articles.prototype.connectDb = function (callback) {
    MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, function (err, database) {
        if (err) {
            callback(err);
        }

        db = database.db('marmolistaselpilar').collection('articles');

        callback(err, database);
    });
};

Articles.prototype.add = function (article, callback) {
    return db.insert(article, callback);
};

Articles.prototype.get = function (_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
};

Articles.prototype.getAll = function (callback) {
    return db.find({}).toArray(callback);
};

Articles.prototype.queryName = function(name, callback) {
    return db.find({name: new RegExp(name, 'i')}).toArray(callback);
};

Articles.prototype.update = function (_id, updatedArticle, callback) {
    return db.update({_id: ObjectId(_id)}, updatedArticle, {}, callback);
};


Articles.prototype.remove = function (_id, callback) {
    return db.remove({_id: ObjectId(_id)}, {multi: true}, callback);
};

module.exports = new Articles();