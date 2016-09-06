//database connection examples
//https://expressjs.com/en/guide/database-integration.html
//

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('testDB.db');

db.serialize(function () {
  db.run("CREATE TABLE Test (col1, col2, col3)");

  db.run("INSERT INTO Test VALUES (?, ?, ?)", ['a1', 'b1', 'c1']);
  db.run("INSERT INTO Test VALUES (?, ?, ?)", ['a2', 'b2', 'c2']);
  db.run("INSERT INTO Test VALUES (?, ?, ?)", ['a3', 'b3', 'c3']);

  db.each("SELECT * FROM Test", function (err, row) {
    console.log(row);
  });
});
db.close();

var mysql = require('mysql');
config = require("./config");
db = config.database;
var connection=mysql.createConnection({
  host:db.host,
  user:db.user,
  password: db.password});
  
connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

connection.end();
