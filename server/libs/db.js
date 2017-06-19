const mongoose = require('mongoose');
const dbConfig = require('./config-loader').database;
const connectionString = 'mongodb://' + dbConfig.host + '/' + dbConfig.database;

const options = {
  user: dbConfig.user,
  pass: dbConfig.password,
};

let connection = null;

class Database {

  open(callback) {
    mongoose.connect(connectionString, options, (err) => {

      console.log('connectionString...');
      console.log(connectionString);
      if (err) {
        console.log('mongoose.connect() failed: ' + err);
      }
    });
    connection = mongoose.connection;
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', (err) => {
      console.log('Error connecting to MongoDB: ' + err);
      callback(err, false);
    });

    mongoose.connection.once('open', () => {
      console.log('We have connected to mongodb');
      callback(null, true);
    });
  }

  // disconnect from database
  close() {

    if (!connection) {
      console.log('DB Close -> No Mongoose connection.');
      process.exit(0);
    }

    connection.close(() => {
      console.log('DB Close -> Mongoose default connection disconnected through app termination');
      process.exit(0);
    });

  }

}
module.exports = new Database();
