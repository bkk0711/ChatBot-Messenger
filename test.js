// const request = require("request");
// const params = {
//   method: 'GET',
//   url: 'https://www.google.com/',
//   proxy: 'http://user-sque-sessionduration-1:UYc0fGpl@us.smartproxy.com:10001'
// }
// request(params, (err, result) => {
// if (err) throw err
//   console.log(result)
// })
var mysql = require('mysql');
 
console.log('Get connection ...');
 
var conn = mysql.createConnection({
  database: 'yeuitnet_chatctuet',
  host: "103.130.216.98",
  user: "yeuitnet_chatctuet",
  password: "0944487635"
});
 
conn.connect(function(err) {
  if (err) throw err;

  console.log("Connected!");
});

conn.connect(function(err) {
 
  conn.query("SELECT * FROM tbl_chat", function (err, result, fields) {
    if (err) throw err;
    console.log(fields)
    console.log(result);
  });
});

