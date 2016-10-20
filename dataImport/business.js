var Business = require('../models/userSchema.js').Business;
var mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var configs = require("../config/config." + env);
var Promise = require('bluebird');
var mongoDb = require('../config/mongoDb');
mongoDb.connect(configs);
var mysqlDb = require('../config/mysqlDb')(configs);

var business = function() {
    return importData('business').then(function(rows) {
        mysqlDb.end();
        var data = [];
        for (var i = 1; i < rows.length; i++) {
            data.push({
                businessType: rows[i].BUSINESSTYPE,
                businessName: rows[i].BUSINESSNAME,
                businessOwner: 'testOwner',
                contactDetails: {
                  email: 'something@gmail.com',
                  mobilePhone: '1234567890',
                  businessPhone: '1234567890',
                  fax: '523523523523'
                },
                addressDetails: {
                  buildingNo: '12',
                  street: 'front street',
                  city: rows[i].BUSINESSCITY,
                  county: 'District ABC',
                  state: rows[i].STATE,
                  country: rows[i].COUNTRY,
                  zip: rows[i].BUSINESSZIP
                },
                createdBy: 'admin@system.com',
                updatedAt: Date.now()
            });
            var records = new Business(data[i-1]);
            records.save(function(err, record) {
            if (err) { 
                console.log(err); 
            }
            //console.log(data[i-1])
            console.log(i)
            });
        }
         //mongoDb.disconnect();
        
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

business();

