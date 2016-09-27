var DonationType = require('../models/userSchema.js').DonationType;
var mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var configs = require("../config/config." + env);
var Promise = require('bluebird');
var mongoDb = require('../config/mongoDb');
mongoDb.connect(configs);
var mysqlDb = require('../config/mysqlDb')(configs);

var abc = function() {
    return importData('donation_type').then(function(rows) {
        mysqlDb.end();
        var data = [];
        for (var i = 1; i < rows.length; i++) {
            data.push({
                donationName: rows[i].name,
                displayName: rows[i].display_name,
                createdBy: 'admin@system.com',
                updatedAt: Date.now()
            });
        }

        DonationType.insertMany(data, function(err, record) {
            if (err) { console.log(err); }
            console.log(record)
            mongoDb.disconnect();
        });
        //console.log('The solution is: ', rows[1]);

    });
};


var importData = function(table) {
    return new Promise(function(resolve, reject) {
        mysqlDb.query('SELECT * from ' + table, function(err, rows, fields) {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

abc();
