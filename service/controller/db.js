const mysql = require('mysql');
const config = require('../config/db_config');
const connection = mysql.createConnection(config.defaultDb);
 
connection.connect();

module.exports = connection;
