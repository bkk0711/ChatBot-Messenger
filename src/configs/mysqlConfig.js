var mysql = require('mysql');
require('dotenv').config();
 
console.log('Get connection ...');
 
var conn = mysql.createConnection({
  database: process.env.mysql_database,
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  password: process.env.mysql_pass
});
try{
  conn.connect(function(err) {
      if (err) throw err;
      console.log("Connected mysql!");
    });

}catch(e){
  reject(e);
}
module.exports = conn;