const mongoose = require('mongoose');
const config = require('./../cfg/config.json');

console.log('------------->', config)

mongoose.connect(config.dbConnection, {useNewUrlParser: true});

let connection  = mongoose.connection;

connection.on('connected', () => {
    console.log('database is connected successfully');
});

connection.on('disconnected', () => {
    console.log('database is disconnected successfully');
})

connection.on('error', console.error.bind(console, 'connection error:'));

module.exports = connection;