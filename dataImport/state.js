var State = require('../models/userSchema.js').State;
var Zones = require('../models/userSchema.js').Zones;
var mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var configs = require("../config/config." + env);
var Promise = require('bluebird');
var mongoDb = require('../config/mongoDb');
mongoDb.connect(configs);
var mysqlDb = require('../config/mysqlDb')(configs);

var stateImport = function() {
    return importData('').then(function(rows){
        return getZoneObjId(rows);
    }).then(function(rows) {
        mysqlDb.end();
        console.log(rows);
        var data = [];
        for (var i = 1; i < rows.length; i++) {
            data.push({
                name: rows[i].state,
                stateCode: rows[i].State_abbr,
                zoneObjID: rows[i].zoneObjID,
                createdBy: 'admin@system.com',
                updatedAt: Date.now()
            });

        }

        State.insertMany(data, function(err, record) {
            if (err) { console.log(err); }
            //console.log(record)
            mongoDb.disconnect();
        });
        //console.log('The solution is: ', rows[1]);

    });
};


var importData = function(table) {
    return new Promise(function(resolve, reject) {
        mysqlDb.query('select t1.state, t1. State_abbr, t1.z_id, t2.Z_name from state as t1 inner join zone as t2 on t1.z_id = t2.z_id', function(err, rows, fields) {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

var getZoneObjId = function(rows){
    return new Promise(function(resolve,reject){
        var i =1
        rows.forEach(function(element) {
            Zones.find({'name':element.Z_name}).then(function(result){
              element.zoneObjID = result[0]._id
              console.log(result[0]._id)
           
            if(rows.length == i){
             resolve(rows);
            }
            i++;
            });
        });
       
    });
};
stateImport();
