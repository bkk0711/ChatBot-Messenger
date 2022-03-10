const {Wit, log} = require('node-wit');
require('dotenv').config();
const clientAI = new Wit({accessToken: process.env.witAIToken});

clientAI.message('Cô cho em hỏi về cách đóng tiền học phí ạ ?', {})
.then((data) => {
  console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
})
.catch(console.error);


module.exports = clientAI;