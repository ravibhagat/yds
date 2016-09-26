var schema = require('./models/userSchema.js');
var mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var configs = require("./config/config." + env);


var mongoDb = require('./config/mongoDb');
mongoDb.connect(configs);
var mysqlDb = require('./config/mysqlDb')(configs);

mysqlDb.query('SELECT * from  donation_type', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[1]);
});

mysqlDb.end();
mongoDb.disconnect();
