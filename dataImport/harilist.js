var Users = require('../models/userSchema.js').Users;
var mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var configs = require("../config/config." + env);
var Promise = require('bluebird');
var mongoDb = require('../config/mongoDb');
mongoDb.connect(configs);
var mysqlDb = require('../config/mysqlDb')(configs);

var userImport = function() {
    var data = [];
    return importData('harilist')
      .then(function(rows) {
        //mysqlDb.end();
        //var data = [];
        var date;
        for (var i = 0; i < rows.length; i++) {
            
            date = rows[i].BIRTHDATE? new Date(rows[i].BIRTHDATE): '';
            data.push({
                oldid: rows[i].HARILISTID,
                firstName: rows[i].FIRSTNAME,
                middleName: rows[i].MIDDLENAME? rows[i].MIDDLENAME : '',
                lastname: rows[i].LASTNAME,
                nickName: rows[i].NICKNAME? rows[i].NICKNAME : '',
                gender: rows[i].GENDER == 'F'? 'female' : 'male',
                birthDay: {
                    day: date? date.getDate() : '',
                    month: date? date.getMonth() : '',
                    year: date? date.getFullYear() : ''
                },
                contactDetails: {
                    email: '',
                    altEmail: '',
                    mobilePhone: '',
                    homePhone: '',
                    workPhone: '',
                    fax: '',
                    messengerId: '',
                },
                addressDetails: {
                    aptNo: rows[i].APTNO?rows[i].APTNO:'',
                    street: rows[i].STREETNO?rows[i].STREETNO:'' + ' ' + rows[i].STREETNAME? rows[i].STREETNAME : '',
                    city: rows[i].CITY,
                    county: rows[i].COUNTY? rows[i].COUNTY: '',
                    state: rows[i].STATE,
                    country: rows[i].COUNTRY? rows[i].COUNTRY : '',
                    zip: rows[i].ZIP? rows[i].ZIP : ''
                },
                profession: '',
                reference: rows[i].REFERENCE? rows[i].REFERENCE : '',
                relationship: rows[i].RELATIONSHIP? rows[i].RELATIONSHIP : '',
                mailSubscription: (rows[i].FOLLOWUP == 0)? true : false,
                //muktType: rows[i].MUKTTYPE? rows[i].MUKTTYPE.toLowerCase(): 'general',
                createdBy: 'admin@system.com',
                updatedAt: Date.now()
            });
        }
        return data;

    }).then(function(data){
        console.log('Length: '+data.length);
        return getRelationalData(data);
    }).then(function(data){
        return datainsert(data);
    }).then(function(data){        
        mysqlDb.end();
        mongoDb.disconnect();
        return null;
    }).catch(function(err){
        if(err){
            console.log(err);
        }
    });
};

var importData = function(table) {
    return new Promise(function(resolve, reject) {
        mysqlDb.query('select t1.* from '+table +' as t1  where t1.deleted != "Y"' , function(err, rows, fields) {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};
var getRelationalData = function(data){
 var myPromise= [];
 data.forEach(function(row){
    console.log(row.oldid);
    myPromise[myPromise.length] = updateMuktaType(row);
 });
 return Promise.all(myPromise).then(function(values){
    data.forEach(function(row, index1){
        var tempArray =[];
        values[index1].forEach(function(val){
            tempArray.push(val.MUKTTYPE.toLowerCase());
        });
        console.log(tempArray);
        row.muktType = tempArray;
    });    
    return data;
 });
}

var datainsert = function(rows){
    
 return new Promise(function(resolve, reject){
    Users.insertMany(rows, function(err, record) {
            if (err) { 
                console.log(err); 
                reject(err);
            }
            resolve(record);
        });
    });
};
var updateMuktaType = function(row){
    return new Promise(function(resolve, reject) {
        var query ='select MUKTTYPE from harilist_mukttype where HARILISTID='+ row.oldid;
        
        mysqlDb.query(query , function(err, res, fields) {
            if (err) {
                reject(err);
            }
            if(res.length > 0)
            {
                resolve(res)
            }else{
                resolve([{"MUKTTYPE":'general'}])
            };
        });
    });
}
userImport();