require('dotenv').config();
import request from "request";
import chatbotService from "../services/chatbotService";
const moment = require("moment");
const { GoogleSpreadsheet } = require('google-spreadsheet');


const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const URL_WEBVIEW_DK = process.env.URL_WEBVIEW_DK;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;
const URL_WEBVIEW_KHMT = process.env.URL_WEBVIEW_KHMT;
const URL_WEBVIEW_CNTT = process.env.URL_WEBVIEW_CNTT;
const URL_WEBVIEW_KTPM = process.env.URL_WEBVIEW_KTPM;
const URL_WEBVIEW_HTTT = process.env.URL_WEBVIEW_HTTT;
const URL_WEBVIEW_KHDL = process.env.URL_WEBVIEW_KHDL;
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
function handleMessage(sender_psid, received_message) {

    let response;

    // Checks if the message contains text
    if (received_message.text) {
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
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;
    let q_payload = received_postback.quick_reply.payload;

    // Set the response based on the postback payload
    switch(q_payload){
        case 'PT1':
            await sender_action(sender_psid);
            let c1 = {"text": "*Sử dụng kết quả học bạ THPT* \n Cách 1 : Điểm xét tuyển bằng tổng điểm trung bình lớp 10 11 và học kì 1 lớp 12 của 3 môn trong tổ hợp môn xét tuyển đạt từ 18 điểm trở lên ( làm tròn đến số thập phân thứ 2 )"}
            await callSendAPI(sender_psid, c1);
            await sender_action(sender_psid);
            let c2 = {"text": "Cách 2 : Điểm xét tuyển bằng tổng điểm trung bình cả năm lớp 12 của 3 môn trong tổ hợp môn xét tuyển từ 18 điểm trở lên ( làm tròn đến số thập phân thứ 2 )",
            "quick_replies":[
                {
                  "content_type":"text",
                  "title":"Tính điểm cách 1",
                  "payload":"TDC1"
                },{
                    "content_type":"text",
                    "title":"Tính điểm cách 2",
                    "payload":"TDC2"
                  }
              ]}
            await setTimeout(() => {callSendQickReplies(sender_psid, c2)}, 1000);


            break;
        case 'PT2':
            await sender_action(sender_psid);
            response = { "text": "*Xét tuyển kết quả kỳ thi tốt nghiệp THPT 2021* \n Điểm xét tuyển bằng tổng điểm ba môn thi tốt nghiệp THPT trong tổ hợp xét tuyển công điểm ưu tiên khu vực, đối tượng " }
            break;
        case 'PT3':
            await sender_action(sender_psid);
            response = { "text": "*Xét tuyển Sử dụng kết quả thi đánh giá năng lực 2021 do ĐH Quốc gia Hồ Chí Minh tổ chức * \n Điểm xét tuyển là điểm bài thi đánh giá năng lực từ 600 điểm trở lên" }
          
            break;
        case 'PT4':
            await sender_action(sender_psid);
            response = { "text": "*Tuyển thẳng theo quy định Bộ Giáo dục và Đào tạo* \n Tuyển thẳng thí sinh đạt giải kỳ thi cấp quốc gia, quốc tế, học sinh có học lực lớp 10, 11, 12 đạt loại khá và hạnh kiểm xếp loại tốt trở lên" }
          
            break;  
            default:
               
    }
    switch(payload) {
        case 'RESET':
        case 'GET_STARTED':
             await chatbotService.handleGetStarted(sender_psid);
          break;
        case 'TUYEN_SINH':
          // code block
          response = {
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":"Thông tin tuyển sinh Khoa Công Nghệ Thông Tin CTUET",
                  "buttons": [
                    {
                        "type": "postback",
                        "title": "Các ngành tuyển sinh",
                        "payload": "CAC_NGANH",
                    },
                    {
                        "type": "postback",
                        "title": "Hình thức xét tuyển",
                        "payload": "HINH_THUC",
                    }
                ],
                }
              }
            }
           
        
          break;
        case 'CAC_NGANH':
            let response1 = { "text": "Hiện tại *Khoa Công Nghệ Thông Tin* đang tuyển sinh các ngành sau đây  " }
            callSendAPI(sender_psid, response1);
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Công Nghệ Thông Tin",
                            "subtitle": "Tap để chọn ",
                            "image_url": "https://i.imgur.com/cskXCn2.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Thông tin",
                                    "payload": "CNTT",
                                }
                            ]
                        },
                        {
                            "title": "Khoa Học Máy Tính",
                            "subtitle": "Tap để chọn ",
                            "image_url": "https://i.imgur.com/GAn372n.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Thông tin",
                                    "payload": "KHMT",
                                }
                            ]
                        },
                        {
                            "title": "Kỹ Thuật Phần Mềm",
                            "subtitle": "Tap để chọn ",
                            "image_url": "https://i.imgur.com/TB6Ha25.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Thông tin",
                                    "payload": "KTPM",
                                }
                            ]
                        },
                        {
                            "title": "Hệ Thống Thông Tin",
                            "subtitle": "Tap để chọn ",
                            "image_url": "https://i.imgur.com/CL0rji9.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Thông tin",
                                    "payload": "HTTT",
                                }
                            ]
                        },
                        {
                            "title": "Khoa Học Dữ Liệu",
                            "subtitle": "Tap để chọn ",
                            "image_url": "https://i.imgur.com/qwf89Z5.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Thông tin",
                                    "payload": "KHDL",
                                }
                            ]
                        }]
                    }
                }
                }
                
                
          break;
        case 'HINH_THUC':
            await sender_action(sender_psid);

            await sender_action(sender_psid);
           let q_repht = { "text": "Hiện tại trường đang có 4 phương thức xét tuyển : \n 1. Sử dụng kết quả học bạ THPT \n 2. Sử dụng kết quả kì thi tốt nghiệp THPT 2021 \n 3.Sử dụng kết quả thi đánh giá năng lực 2021 do ĐH Quốc gia Hồ Chí Minh tổ chức  \n 4. Tuyển thẳng ",
               "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"Phương thức 1",
                      "payload":"PT1"
                    },{
                        "content_type":"text",
                        "title":"Phương thức 2",
                        "payload":"PT2"
                      },
                      {
                        "content_type":"text",
                        "title":"Phương thức 3",
                        "payload":"PT3"
                      },
                      {
                        "content_type":"text",
                        "title":"Phương thức 4",
                        "payload":"PT4"
                      }
                  ]}
                  callSendQickReplies(sender_psid, q_repht)
           // await setTimeout(() => {callSendQickReplies(sender_psid, q_repht)}, 2000);
            break;
          
        case 'LIEN_HE':
            await sender_action(sender_psid);
            let lienhe = {"text": "Phòng Đào Tạo : Số 256, đường Nguyễn Văn Cừ, phường AN Hòa, quận Ninh Kiều, TP Cần Thơ \n Số điện thoại : 0292.3898167 "}
            await callSendAPI(sender_psid, lienhe);

            break;
        case 'CNTT':
            await sender_action(sender_psid);
            let cntt = {"text": "Thông tin : Ngành Công Nghệ Thông Tin"}
            await callSendAPI(sender_psid, cntt);

            await sender_action(sender_psid);

            let cntt1 = { "text": "Mã trường : KCC"}
            await callSendAPI(sender_psid, cntt1);

            await sender_action(sender_psid);
            
            let cntt2 = { "text": "Mã ngành : 7480201 "}
            await callSendAPI(sender_psid, cntt2);

            await sender_action(sender_psid);
            
            // let cntt3 = {  "text": " " }
            // callSendAPI(sender_psid, cntt3);
            let cntt4 = {
                "text": " Tổ hợp xét tuyển : A00, A01, C01, D01",
                }
            await callSendAPI(sender_psid, cntt4);
            await sender_action(sender_psid);
            await sleep(2000);
            let cntt_btn = {
                "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":"Xem thêm các thông tin khác ",
                      "buttons":[
                        {
                          "type":"postback",
                          "title": "Các ngành tuyển sinh",
                          "payload": "CAC_NGANH",
                        },
                        {
                            "type":"web_url",
                            "url": `${URL_WEBVIEW_CNTT}`,
                            "title": "Xem Chi tiết",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": "true"
                        },
                        {
                            "type":"postback",
                            "title":"Quay về",
                            "payload":"TUYEN_SINH"
                          }
                      ]
                    }
                  }
                }
                await callSendAPI(sender_psid, cntt_btn);
            
                // "quick_replies":[
                //     {
                //       "content_type":"text",
                //       "title":"Đăng Ký Tư Vấn Ngay",
                //       "payload":"DANG_KY",
                //     },{
                //       "content_type":"text",
                //       "title":"Tạo Ảnh Thông Tin",
                //       "payload":"IMG_CNTT",
                //     }
                //   ]
            //   await setTimeout(() => {callSendQickReplies(sender_psid, cntt4)}, 2000);
            // await callSendQickReplies(sender_psid, cntt4);
            break;
        case 'KHMT':
            await sender_action(sender_psid);
            let khmt = {"text": "Thông tin : Ngành Khoa Học Máy Tính"}
            await callSendAPI(sender_psid, khmt);

            await sender_action(sender_psid);

            let khmt1 = { "text": "Mã trường : KCC"}
            await callSendAPI(sender_psid, khmt1);

            await sender_action(sender_psid);
            
            let khmt2 = { "text": "Mã ngành : 7480101 "}
            await callSendAPI(sender_psid, khmt2);

            await sender_action(sender_psid);
            
            // let cntt3 = {  "text": " " }
            // callSendAPI(sender_psid, cntt3);
            let khmt3 = {
                "text": " Tổ hợp xét tuyển : A00, A01, C01, D01",
                }
            await callSendAPI(sender_psid, khmt3);
            await sender_action(sender_psid);
            await sleep(2000);
            let khmt_btn = {
                "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":"Xem thêm các thông tin khác ",
                      "buttons":[
                        {
                          "type":"postback",
                          "title": "Các ngành tuyển sinh",
                          "payload": "CAC_NGANH",
                        },
                        {
                            "type":"web_url",
                            "url": `${URL_WEBVIEW_KHMT}`,
                            "title": "Xem Chi tiết",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": "true"
                        },
                        {
                            "type":"postback",
                            "title":"Quay về",
                            "payload":"TUYEN_SINH"
                          }
                      ]
                    }
                  }
                }
                await callSendAPI(sender_psid, khmt_btn);
            break;
        case 'KTPM':
            await sender_action(sender_psid);
            let ktpm = {"text": "Thông tin : Ngành Kỹ Thuật Phần Mềm"}
            await callSendAPI(sender_psid, ktpm);

            await sender_action(sender_psid);

            let ktpm1 = { "text": "Mã trường : KCC"}
            await callSendAPI(sender_psid, ktpm1);

            await sender_action(sender_psid);
            
            let ktpm2 = { "text": "Mã ngành : 7480103 "}
            await callSendAPI(sender_psid, ktpm2);

            await sender_action(sender_psid);
            
            // let ktpm3 = {  "text": " " }
            // callSendAPI(sender_psid, ktpm3);
            let ktpm4 = {
                "text": " Tổ hợp xét tuyển : A00, A01, C01, D01",
                }
            await callSendAPI(sender_psid, ktpm4);
            await sender_action(sender_psid);
            await sleep(2000);
            let ktpm_btn = {
                "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":"Xem thêm các thông tin khác ",
                      "buttons":[
                        {
                          "type":"postback",
                          "title": "Các ngành tuyển sinh",
                          "payload": "CAC_NGANH",
                        },
                        {
                            "type":"web_url",
                            "url": `${URL_WEBVIEW_KTPM}`,
                            "title": "Xem Chi tiết",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": "true"
                        },
                        {
                            "type":"postback",
                            "title":"Quay về",
                            "payload":"TUYEN_SINH"
                          }
                      ]
                    }
                  }
                }
                await callSendAPI(sender_psid, ktpm_btn);
            break;
        case 'HTTT':
            await sender_action(sender_psid);
            let httt = {"text": "Thông tin : Ngành Hệ Thống Thông Tin"}
            await callSendAPI(sender_psid, httt);

            await sender_action(sender_psid);

            let httt1 = { "text": "Mã trường : KCC"}
            await callSendAPI(sender_psid, httt1);

            await sender_action(sender_psid);
            
            let httt2 = { "text": "Mã ngành : 7480104 "}
            await callSendAPI(sender_psid, httt2);

            await sender_action(sender_psid);
            
            // let httt3 = {  "text": " " }
            // callSendAPI(sender_psid, httt3);
            let httt4 = {
                "text": " Tổ hợp xét tuyển : A00, A01, C01, D01",
                }
            await callSendAPI(sender_psid, httt4);
            await sender_action(sender_psid);
            await sleep(2000);
            let httt_btn = {
                "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":"Xem thêm các thông tin khác ",
                      "buttons":[
                        {
                          "type":"postback",
                          "title": "Các ngành tuyển sinh",
                          "payload": "CAC_NGANH",
                        },
                        {
                            "type":"web_url",
                            "url": `${URL_WEBVIEW_HTTT}`,
                            "title": "Xem Chi tiết",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": "true"
                        },
                        {
                            "type":"postback",
                            "title":"Quay về",
                            "payload":"TUYEN_SINH"
                          }
                      ]
                    }
                  }
                }
                await callSendAPI(sender_psid, httt_btn);
            break;
        case 'KHDL':
            await sender_action(sender_psid);
            let khdl = {"text": "Thông tin : Ngành Khoa Học Dữ Liệu"}
            await callSendAPI(sender_psid, khdl);

            await sender_action(sender_psid);

            let khdl1 = { "text": "Mã trường : KCC"}
            await callSendAPI(sender_psid, khdl1);

            await sender_action(sender_psid);
            
            let khdl2 = { "text": "Mã ngành : 7480109"}
            await callSendAPI(sender_psid, khdl2);

            await sender_action(sender_psid);
            
            // let khdl3 = {  "text": " " }
            // callSendAPI(sender_psid, khdl3);
            let khdl4 = {
                "text": " Tổ hợp xét tuyển : A00, A01, C01, D01",
                }
            await callSendAPI(sender_psid, khdl4);
            await sender_action(sender_psid);
            await sleep(2000);
            let khdl_btn = {
                "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":"Xem thêm các thông tin khác ",
                      "buttons":[
                        {
                          "type":"postback",
                          "title": "Các ngành tuyển sinh",
                          "payload": "CAC_NGANH",
                        },
                        {
                            "type":"web_url",
                            "url": `${URL_WEBVIEW_KHDL}`,
                            "title": "Xem Chi tiết",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": "true"
                        },
                        {
                            "type":"postback",
                            "title":"Quay về",
                            "payload":"TUYEN_SINH"
                          }
                      ]
                    }
                  }
                }
                await callSendAPI(sender_psid, khdl_btn);
                break; 
        default:
          // code block
      }

    // if (payload === 'GET_STARTED'){
       
    //    // response = { "text": "Chào mừng bạn đến với Khoa Công Nghệ Thông Tin, Trường đại học Kỹ thuật - Công nghệ Cần Thơ" }

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
        "uri": "https://graph.facebook.com/v10.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        
        if (!err) {
            console.log('message sent!')
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
        "uri": "https://graph.facebook.com/v10.0/me/messages",
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
        "whitelisted_domains": ["https://chatctut.herokuapp.com/"]
       
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
                            "title": "Menu Chính",
                            "payload": "MAIN_MENU"
                        },
                        {
                            "type": "postback",
                            "title": "Thông Tin Về Khoa",
                            "payload": "TT_KHOA"
                        },
                        {
                            "type": "web_url",
                            "title": "Thông tin về trường",
                            "url": "https://www.ctuet.edu.vn",
                            "webview_height_ratio": "full"
                        },
                        {
                            "type": "postback",
                            "title": "Khởi động lại BOT",
                            "payload": "RESET"
                        },
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
    return res.render('dang_ky.ejs');

}
let handlePostRegister = async (req, res)  =>{
    try{
        let customerName = "";
        if(req.body.customerName == ""){
            customerName = await chatbotService.getInfoProfile(req.body.psid, 'full_name');
        }else customerName = req.body.customerName;
        let replyreg = {
            "text": `</----- *Thông tin đăng ký tư vấn* ------/>
            \nHọ và Tên: ${customerName}
            \nSố điện thoại: ${req.body.phoneNumber}
            \nĐịa chỉ Email:  ${req.body.email}`   
        }
        await sender_action(req.body.psid);
        await callSendAPI(req.body.psid, replyreg);

        let replyreg1 = {
            "text": `Bạn đã đăng ký tư vấn thành công!! 
Bộ phận tuyển sinh sẽ liên lạc và tư vấn cho bạn trong tương lai`   
        }
        await sender_action(req.body.psid);
        await callSendAPI(req.body.psid, replyreg1);

        // write to sheet
        let currentDate = new Date();

        const format = "HH:mm DD/MM/YYYY"

        let formatedDate = moment(currentDate).format(format);

        // Initialize the sheet - doc ID is the long id in the sheets URL
        const doc = new GoogleSpreadsheet(SHEET_ID);

        // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
        // for other sẻver
        // await doc.useServiceAccountAuth({
        //     client_email: CLIENT_EMAIL,
        //     private_key: PRIVATE_KEY,
        // });
        // for heroku
        await doc.useServiceAccountAuth({
            client_email:JSON.parse(`"${CLIENT_EMAIL}"`) ,
            private_key: JSON.parse(`"${PRIVATE_KEY}"`) ,
        });

        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        let fbName = await chatbotService.getInfoProfile(req.body.psid, 'full_name');
        await sheet.addRow(
            {
                "Tên Facebook": fbName,
                "Email": `${req.body.email}`,
                "Số điện thoại": `'${req.body.phoneNumber}`,
                "Thời gian": formatedDate,
                "Tên khách hàng": customerName
            });
            
            console.log('write to sheet done');


    }catch(e){
        console.log(e);
    }
}

let getGoogleSheet = async (req, res) => {
    try {

        let currentDate = new Date();

        const format = "HH:mm DD/MM/YYYY"

        let formatedDate = moment(currentDate).format(format);

        // Initialize the sheet - doc ID is the long id in the sheets URL
        const doc = new GoogleSpreadsheet(SHEET_ID);

        // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });

        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        // append rows
        await sheet.addRow(
            {
                "Tên Facebook": 'Hỏi Dân IT',
                "Email": 'haryphamdev@gmail.com',
                "Số điện thoại": `'0321456789`,
                "Thời gian": formatedDate,
                "Tên khách hàng": "Eric"
            });


        return res.send('Writing data to Google Sheet succeeds!')
    }
    catch (e) {
        return res.send('Oops! Something wrongs, check logs console for detail ... ')
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