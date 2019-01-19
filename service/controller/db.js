const mysql = require('mysql');
const config = require('../config/db_config');
const connection = mysql.createConnection(config.defaultDb);
 
connection.connect();

const query = function (sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    })
  })
}

module.exports = query;
