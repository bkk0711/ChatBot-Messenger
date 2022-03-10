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
  database: 'chatbot',
  host: "localhost",
  user: "root",
  password: ""
});
 
conn.connect(function(err) {
  if (err) throw err;

  console.log("Connected!");
});

// conn.connect(function(err) {
 

// });

// conn.query("SELECT * FROM tbl_chat", function (err, result, fields) {
//   if (err) throw err;
//   console.log(fields)
//   console.log(result[0].content);
// });

//conn.query("INSERT INTO `tbl_admin`(`user`, `pass`, `email`) VALUES ('user', '0123456', 'boylaboy@hcom.cpm')");


const {Wit, log} = require('node-wit');
require('dotenv').config();
const clientAI = new Wit({accessToken: process.env.witAIToken});

// clientAI.message('Cô cho em hỏi về cách đóng tiền học phí ạ ?', function(err, data){
//   console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
// });
clientAI.message('học bổng').then(({entities, intents, traits}) => {
  // You can customize your response using these
  // console.log(intents); //entities['tu_khoa:tu_khoa'][0]['body']
  try {
    if(entities['tu_khoa:tu_khoa'][0]['body']){
      console.log(entities);
    }
  } catch (error) {
    console.log("null");
  }
  
  // console.log(entities);
  // console.log(traits);
  // For now, let's reply with another automatic message
 
})
.catch((err) => {
  console.error('Oops! Got an error from Wit: ', err.stack || err);
})
// .then((data) => {
//   // console.log(data.intents[0].id)
//   console.log(JSON.stringify(data.entities['tu_khoa:tu_khoa'][0].body))
//   // console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
// })
// .catch(console.error);


module.exports = clientAI;