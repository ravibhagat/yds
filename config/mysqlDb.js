'use strict';

var mysql = require('mysql');
module.exports = function (configs) {
    var connection = mysql.createConnection({
  		host     : configs.host,
  		user     : configs.user,
  		password : configs.sqlPassword,
  		database : configs.database,
	});
    connection.connect();
    return connection;
};
