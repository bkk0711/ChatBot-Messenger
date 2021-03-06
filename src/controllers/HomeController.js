require('dotenv').config();
var decode = require('decode-html');
import request from "request";
import chatbotService from "../services/chatbotService";
const moment = require("moment");
const { GoogleSpreadsheet } = require('google-spreadsheet');
import mysqlConfig from "../configs/mysqlConfig";
//wit.ai
const {Wit, log} = require('node-wit');
const clientAI = new Wit({accessToken: process.env.witAIToken});
//end wit.ai

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const URL_WEBVIEW_DK = process.env.URL_WEBVIEW_DK;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;


//process.env.NAME_VARIABLES
let getHomePage = (req, res) => {
    return res.render('homepage.ejs');
};

let postWebhook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

// Handles messages events
async function handleMessage(sender_psid, received_message) {

    let response;
    let fullname = await chatbotService.getInfoProfile(sender_psid, 'full_name');
    // Checks if the message contains text
    if (received_message.text) {
        
        mysqlConfig.query(`SELECT * FROM tbl_user WHERE idfb='${sender_psid}'`, function (err0, result0, fields0) {
           
        
        
        if(result0[0].act == 0){

        
            let kq_nd = null;
            clientAI.message(received_message.text, {})
            .then(({entities, intents, traits}) => {
            // console.log(entities)
            try {

                console.log(JSON.stringify(entities['tu_khoa:tu_khoa'][0]['body']))
                let cauhoi = entities['tu_khoa:tu_khoa'][0]['body']; //ORDER BY rand() 
                mysqlConfig.query(`SELECT * FROM tbl_chat WHERE MATCH (keyword) AGAINST ('${cauhoi}' IN NATURAL LANGUAGE MODE) LIMIT 1`, function (err, result, fields) {
                    // kq = result;

            
                    try {
                        
                        console.log("fulname :" + fullname)
                        var content = result[0].content
                        content = content.replace('@name', fullname)
                        newline(sender_psid, content)
                
                        if(result[0].file != 0){
                        
                            let url;
                            let fname;
                            mysqlConfig.query(`SELECT * FROM tbl_file WHERE id = '${result[0].file}' LIMIT 1`, function (err, results, fields){
                                url = results[0].url;
                                fname = results[0].name;
                                console.log(fname + " === " +url);
                                let response12 = {
                                "attachment":{
                                    "type":"template",
                                    "payload":{
                                    "template_type":"button",
                                    "text": results[0].name,
                                    "buttons":[
                                        {
                                        "type":"web_url",
                                        "url":results[0].url,
                                        "title":"Xem T???i ????y"
                                        }
                                    ]
                                    }
                                }
                            }
                            callSendAPI(sender_psid, response12);
                            });
                            
                            
                        }
                        // else if(result[0].content){
                        //     newline(sender_psid, content)
                        //     // let response1 = {
                        //     //     "text": content
                        //     // }
                        //     // callSendAPI(sender_psid, response1);
                        // }

                    } catch (error) {
                        // console.log(error)
                    
                        let response2 = {
                            "text": `C??u tr??? l???i ch??a ???????c c???p nh???t tr??n h??? th???ng. C?? s??? l??u c??u h???i l???i v?? c???p nh???t tr??n h??? th???ng v??i m???i cu???i tu???n nh??.`

                        }
                        callSendAPI(sender_psid, response2);
                    }
                
                
                
                });
            } catch (error) { //ORDER BY rand()
                mysqlConfig.query(`SELECT * FROM tbl_chat WHERE MATCH (keyword) AGAINST ('${received_message.text}' IN NATURAL LANGUAGE MODE) LIMIT 1`, function (err, result, fields) {
                    // kq = result;
            
                    try {
                        
                        var content = result[0].content
                        content = content.replace('@name', fullname)
                        newline(sender_psid, content)
                    
                        if(result[0].file != 0){
                            
                            let url;
                            let fname;
                            mysqlConfig.query(`SELECT * FROM tbl_file WHERE id = '${result[0].file}' LIMIT 1`, function (err, results, fields){
                                url = results[0].url;
                                fname = results[0].name;
                                // console.log(fname + " === " +url);
                                let response12 = {
                                "attachment":{
                                    "type":"template",
                                    "payload":{
                                    "template_type":"button",
                                    "text": results[0].name,
                                    "buttons":[
                                        {
                                        "type":"web_url",
                                        "url":results[0].url,
                                        "title":"Xem T???i ????y"
                                        }
                                    ]
                                    }
                                }
                            }
                            callSendAPI(sender_psid, response12);
                            });
                            
                            
                        }
                        // else if(result[0].content){
                        //     newline(sender_psid, content)
                        //     // let response1 = {
                        //     //     "text": content
                        //     // }
                        //     // callSendAPI(sender_psid, response1);
                        // }

                    } catch (error) {
                        // console.log(error)
                    
                        let response2 = {
                            "text": `C??u tr??? l???i ch??a ???????c c???p nh???t tr??n h??? th???ng. C?? s??? l??u c??u h???i l???i v?? c???p nh???t tr??n h??? th???ng v??i m???i cu???i tu???n nh??.`

                        }
                        callSendAPI(sender_psid, response2);
                    }
                
                
                
                });
            }
            
            // console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));

                
            })
            .catch(console.error);
        }
    });
       
       
            // console.log(kq_nd+ " 54545");
            // if(kq_nd != null){
            //     response = {
            //         "text": kq_nd
            //     }
            // }else{
            //     response = {
            //         "text": `C??u tr??? l???i ch??a ???????c c???p nh???t tr??n h??? th???ng. C?? s??? l??u c??u h???i l???i v?? c???p nh???t tr??n h??? th???ng v??i m???i cu???i tu???n nh??.`
            //     }
            // }
           
            // callSendAPI(sender_psid, responsea);
        //     if(result != null){
        //        console.log(result[0].content);
        //         response = {
        //             "text": result[0].content
        //         }

        //    }else{
               
        //     response = {
        //         "text": `C??u tr??? l???i ch??a ???????c c???p nh???t tr??n h??? th???ng. C?? s??? l??u c??u h???i l???i v?? c???p nh???t tr??n h??? th???ng v??i m???i cu???i tu???n nh??.`
        //     }
        //    }

        // });

        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        // response = {
        //     "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        // }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        // response = {
        //     "attachment": {
        //         "type": "template",
        //         "payload": {
        //             "template_type": "generic",
        //             "elements": [{
        //                 "title": "Is this the right picture?",
        //                 "subtitle": "Tap a button to answer.",
        //                 "image_url": attachment_url,
        //                 "buttons": [
        //                     {
        //                         "type": "postback",
        //                         "title": "Yes!",
        //                         "payload": "yes",
        //                     },
        //                     {
        //                         "type": "postback",
        //                         "title": "No!",
        //                         "payload": "no",
        //                     }
        //                 ],
        //             }]
        //         }
        //     }
        // }
    }

    // Send the response message
    // callSendAPI(sender_psid, response);
}


  
async function newline(sender_psid, message){
    const newmes = message.split("@next")

    if(newmes.length > 1){
        for (const val of newmes) { 
            await sender_action(sender_psid);
            await sleep(2000);
            let response1 = {
                "text": decode(val)
            }
            await callSendAPI(sender_psid, response1);
            
        }
    }else{
        let response1 = {
            "text": decode(message)
        }
        await callSendAPI(sender_psid, response1);
    }
    
}
// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;
   
   
    switch(payload) {
        case 'RESET':
        case 'GET_STARTED':
             await chatbotService.handleGetStarted(sender_psid);
          break;
        case 'HUONG_DAN':
          
            await sender_action(sender_psid);
            let hdsd = {
                "text": "B???n ch??? c???n chat nh???ng n???i dung ho???c t??? kho?? m?? b???n c???n t??m... C?? M??o s??? t??m gi??p b???n nha!!!"
            }

            await callSendAPI(sender_psid, hdsd);
           
        
          break;
          //.
          case 'GIOI_THIEU':
            await sender_action(sender_psid);
            let gt = {
                "text": "C?? M??o l?? m???t nh??n v???t h?? c???u, m???t chatbot c?? kh??? n??ng tr??? l???i t??? ?????ng gi??p sinh vi??n CTUT trong v???n ????? h???c t???p"
            }

            await callSendAPI(sender_psid, gt);
          break;
        case 'CHUC_NANG':
            await sender_action(sender_psid);
            let cn = {
                "text": "????y l?? danh s??ch ch???c n??ng c???a C?? ??? hi???n t???i, s??? c??n update trong th???i gian sau nha!!!"
            }
            await callSendAPI(sender_psid, cn);
            await sleep(2000);
            await sender_action(sender_psid);
            let responsess = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Danh s??ch ch???c n??ng",
                            "subtitle": "Tap ????? ch???n ",
                            "image_url": "",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Chat V???i CVHT",
                                    "payload": "CHAT_CVHT",
                                },
                                {
                                    "type": "postback",
                                    "title": "Chat v???i BOT",
                                    "payload": "CHAT_BOT",
                                }
                            ],
                        }]
                    }
                }
            }
          
            await callSendAPI(sender_psid, responsess);
        
          break;
        
        case 'MAIN_MENU':
            await sender_action(sender_psid);
            await chatbotService.handleGetStarted(sender_psid);

            break;
        case 'CHAT_CVHT':
            await sender_action(sender_psid);
            let chat_cvht = {
                "text": "B???n ???? ch???n ch???c n??ng chat v???i CVHT. B???n h??y nh???p n???i ??ung tin nh???n v?? ch??? CVHT tr??? l???i nh??!!"
            }

            await callSendAPI(sender_psid, chat_cvht);
            await mysqlConfig.query(`UPDATE tbl_user SET act='1' WHERE idfb='${sender_psid}'`);


            break;
         
        case 'CHAT_BOT':
            await sender_action(sender_psid);
            let chat_bot = {
                "text": "B???n ???? ch???n ch???c n??ng chat v???i BOT. B???n h??y nh???p n???i ??ung tin nh???n ho???c t??? kho?? n???i dung, Chatbot s??? h??? tr??? b???n nh??!!"
            } 
            await callSendAPI(sender_psid, chat_bot);
            await mysqlConfig.query(`UPDATE tbl_user SET act='0' WHERE idfb='${sender_psid}'`);
            break;
        
        default:
          // code block
      }

    // if (payload === 'GET_STARTED'){
       
    //    // response = { "text": "Ch??o m???ng b???n ?????n v???i Khoa C??ng Ngh??? Th??ng Tin, Tr?????ng ?????i h???c K??? thu???t - C??ng ngh??? C???n Th??" }

    // }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}
function sender_action(sender_psid){
    let request_body = {
        "recipient":{
        "id":sender_psid
        },
        "sender_action":"typing_on"
    }
     // Send the HTTP request to the Messenger Platform
     request({
        "uri": "https://graph.facebook.com/v10.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        
        if (!err) {
            console.log('Typing.....')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

}
// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v11.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        
        if (!err) {
            console.log('message sent! ')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   
function callSendQickReplies(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "messaging_type": "RESPONSE",
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v11.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        
        if (!err) {
            console.log('message sent Qickly!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}




let setupProfile = async(req, res) =>{

    let request_body = {
        
        "get_started": {"payload":"GET_STARTED"},
        "whitelisted_domains": ["https://4cf2-2405-4802-d0c9-57a0-f586-d288-53f1-df4e.ngrok.io"]
       
    }

    await request({
        "uri": `https://graph.facebook.com/v10.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body);
        if (!err) {
            console.log('Setup Profile success')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
    return res.send("Success");
}

let setupmenu = async(req, res) =>{

    let request_body = 
        {
            "persistent_menu": [
                {
                    "locale": "default",
                    "composer_input_disabled": false,
                    "call_to_actions": [
                        {
                            "type": "postback",
                            "title": "Reset BOT",
                            "payload": "MAIN_MENU"
                        },
                        {
                            "type": "postback",
                            "title": "Chat Tr???c Ti???p",
                            "payload": ""
                        }
                        ,
                        {
                            "type": "postback",
                            "title": "Chat V???i BOT",
                            "payload": "CHAT_BOT"
                        }
                        // ,
                        // {
                        //     "type": "web_url",
                        //     "title": "Th??ng tin v??? tr?????ng",
                        //     "url": "https://www.ctuet.edu.vn",
                        //     "webview_height_ratio": "full"
                        // },
                        // {
                        //     "type": "postback",
                        //     "title": "Kh???i ?????ng l???i BOT",
                        //     "payload": "RESET"
                        // },
                    ]
                }
            ]
        }
       
    

    await request({
        "uri": `https://graph.facebook.com/v10.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body);
        if (!err) {
            console.log('Setup Profile success')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
    return res.send("Success");
}

let handleRegister = (req, res) =>{
    return res.render('gopy.ejs');

}
let handlePostRegister = async (req, res)  =>{
    try{
        let title = "";
        let url = "";
        if(req.body.title == ""){
            title = "G??p ?? #" + req.body.psid
        }else title = req.body.title;
        if(req.body.url == ""){
            url = ""
        }else url = req.body.url;
        let replyreg = {
            "text": `</----- *Th??ng tin G??p ??* ------/>
            \nTi??u ?????: ${title}
            \nN???i dung: ${req.body.noidung}
            \nurl:  ${req.body.url}`   
        }
        await sender_action(req.body.psid);
        await callSendAPI(req.body.psid, replyreg);
        await mysqlConfig.query(`INSERT INTO tbl_gopy( idfb, tieude, noidung, url, time) VALUES ('${req.body.psid}','${title}','${req.body.noidung}','${url}','${Math.floor(Date.now() / 1000)}')`);
        let replyreg1 = {
            "text": `B???n ???? g??p ?? th??nh c??ng!! 
B??? ph???n qu???n l?? s??? xem x??t v?? c???p nh???t s???m nh???t b???n nha`   
        }
        await sender_action(req.body.psid);
        await callSendAPI(req.body.psid, replyreg1);

        // write to sheet
       // let currentDate = new Date();

       // const format = "HH:mm DD/MM/YYYY"

       // let formatedDate = moment(currentDate).format(format);

        // Initialize the sheet - doc ID is the long id in the sheets URL
        //const doc = new GoogleSpreadsheet(SHEET_ID);

        // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
        // for other s???ver
        // await doc.useServiceAccountAuth({
        //     client_email: CLIENT_EMAIL,
        //     private_key: PRIVATE_KEY,
        // });
        // for heroku
        // await doc.useServiceAccountAuth({
        //     client_email:JSON.parse(`"${CLIENT_EMAIL}"`) ,
        //     private_key: JSON.parse(`"${PRIVATE_KEY}"`) ,
        // });

        // await doc.loadInfo(); // loads document properties and worksheets

        // const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        // let fbName = await chatbotService.getInfoProfile(req.body.psid, 'full_name');
        // await sheet.addRow(
        //     {
        //         "T??n Facebook": fbName,
        //         "Email": `${req.body.email}`,
        //         "S??? ??i???n tho???i": `'${req.body.phoneNumber}`,
        //         "Th???i gian": formatedDate,
        //         "T??n kh??ch h??ng": customerName
        //     });
            
        //     console.log('write to sheet done');


    }catch(e){
        console.log(e);
    }
}


module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupmenu : setupmenu,
    handleRegister: handleRegister,
    handlePostRegister:handlePostRegister

}