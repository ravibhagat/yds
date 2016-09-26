'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
module.exports = function (configs) {
    mongoose.connect(configs.dbUrl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log(configs.dbUrl + ' db opened');
    });
};
