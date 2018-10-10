const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'fjy_db';

const myInsert = function(tableName, params, callback) {
	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		console.log("Connected successfully to server");

		const db = client.db(dbName);

		// Insert some documents
		db.collection(tableName).insert(params, function(err, result) {
			if(err) {
				console.log('Error:' + err);
				return;
			}
			callback(result);
		})

		client.close();
	});

}

const myQuery = function(tableName, params, callback) {

	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		console.log("Connected successfully to server");

		const db = client.db(dbName);

		// Find some documents
		db.collection(tableName).find(params||{}).toArray(function(err, docs) {
			assert.equal(err, null);
			console.log("Found the following records");
			callback(docs);
		});

		client.close();
	});

}

const myUpdate = function(tableName,condition, params, callback) {

	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		
		const db = client.db(dbName);
		// condition:条件
		// params：参数
		db.collection(tableName).update(condition, {
			$set: params
		}, function(err, result) {
			if(err) {
				console.log('Error:' + err);
				return;
			}
			callback(result);
		});
	});

}
module.exports = {
	myQuery,
	myInsert,
	myUpdate
}