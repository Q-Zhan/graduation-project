var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'a01301212',
  database : 'onlinechat'
});
 
connection.connect();
 
connection.query('select * from user_info', function (error, results, fields) {
  if (error) throw error;
  console.log(results[0].userID)
});