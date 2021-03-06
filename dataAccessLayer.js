const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const databaseName = 'healthy-items-db';
const collectionName = 'items';
const mongoDbUrl = process.env.MONGODB_CONNECTION_STRING;
const settings = {
    useUnifiedTopology: true
};
console.log('mongoDbUrl: ' + mongoDbUrl);

let database;

const Connect = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoDbUrl, settings, function(err, client) {
            if(err) {
                reject(err);
            }
            else {
                console.log('SUCCESSFULLY CONNECTED TO DATABASE!');
                database = client.db(databaseName);
                resolve();
            }
        });
    });
};

const Insert = function(item) {
    return new Promise((resolve, reject) => {
        const productCollection = database.collection(collectionName);
        productCollection.insertOne(item, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully inserted a new document');
                resolve(res);
            }
        });
    });
};

const Find = function(options = {}) {
    let query = {
        objectQuery: {},
        sort: {},
    };

    if (Object.keys(options).length > 0) {
        if(options.q) {
            query.objectQuery.name = { $regex: `.*${options.q}.*`, $options: 'i' };
        }

        if(options.orderBy && options.orderByValue) {
            query.sort[options.orderBy] = (options.orderByValue === 'asc' ? -1 : 1);
        }
    }

    return new Promise((resolve, reject) => {
        const productCollection = database.collection(collectionName);

        productCollection
            .find(query.objectQuery)
            .sort(query.sort)
            .toArray(function(err, res) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(res);
                    console.log('successfully found items');
                }
        });
    });
};

const Update = function(item, newItem) {
    return new Promise((resolve, reject) => {
        const productCollection = database.collection(collectionName);
        productCollection.updateOne(item, newItem, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully updated items');
                resolve(res);
            }
        });
    });
};

const Remove = function(item) {
    return new Promise((resolve, reject) => {
        const productCollection = database.collection(collectionName);
        productCollection.deleteOne(item, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully removed an item');
                resolve(res);
            }
        });
    });
};

module.exports = { Connect, Insert, Find, Update, Remove };