import { response } from "express";
import request from "request"
require('dotenv').config();
import mysqlConfig from "../configs/mysqlConfig";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const URL_WEBVIEW_DK = process.env.URL_WEBVIEW_DK;
let getInfoProfile = (sender_psid, typeif) =>{
    return new Promise(async (resolve, reject) => {
        let info = '';
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "GET"
        }, (err, res, body) => {
            // {
            //     "first_name": "Peter",
            //     "last_name": "Chang",
            //     "profile_pic": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p200x200/13055603_10105219398495383_8237637584159975445_n.jpg?oh=1d241d4b6d4dac50eaf9bb73288ea192&oe=57AF5C03&__gda__=1470213755_ab17c8c8e3a0a447fed3f272fa2179ce",
            //     "locale": "en_US",
            //     "timezone": -7,
            //     "gender": "male",
            //   }
            // console.log(body);

            
            
            if (!err) {
            body = JSON.parse(body);
            mysqlConfig.query(`SELECT * FROM tbl_user WHERE idfb = '${sender_psid}' `, function (err, result, fields) {
                try {
                    if(result[0].idfb != null){
                        mysqlConfig.query(`UPDATE tbl_user SET first_name='${body.first_name}',last_name='${body.last_name}',profile_pic='${body.profile_pic}',gender='${body.gender}' WHERE idfb='${sender_psid}'`);
                        console.log("update user")
                    }else{
                        mysqlConfig.query(`INSERT INTO tbl_user(idfb, first_name, last_name, profile_pic, gender, act, time) VALUES ('${sender_psid}', '${body.first_name}', '${body.last_name}', '${body.profile_pic}', '${body.gender}', '0', '${Math.floor(Date.now() / 1000)}')`);
                        console.log("insert user 0")
                    }
                } catch (error) {
                    mysqlConfig.query(`INSERT INTO tbl_user(idfb, first_name, last_name, profile_pic, gender, act, time) VALUES ('${sender_psid}', '${body.first_name}', '${body.last_name}', '${body.profile_pic}', '${body.gender}', '0', '${Math.floor(Date.now() / 1000)}')`);
                    console.log("insert user 1")
                    
                }
                
            });
            //console.log(`INSERT INTO tbl_user(idfb, first_name, last_name, profile_pic, gender, act, time) VALUES ('${sender_psid}', '${body.first_name}', '${body.last_name}', '${body.profile_pic}', '${body.gender}', '0', '${Date.now()}')`);
            if(typeif == 'full_name'){
                info = `${body.last_name} ${body.first_name}`;
            }else if(typeif == 'first_name'){
                info = body.first_name;
            }else if(typeif == 'last_name'){
                info = body.last_name;
            }else if(typeif == 'profile_pic'){
                info = body.profile_pic;
            }else if(typeif == 'gender') {
                info = body.gender;
            }
                resolve(info);
            } else {
                reject(err);
            }
        });
        
    })
}
   


let callSendAPI = (sender_psid, response) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        
        if (!err) {
            console.log('message sent !')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
let handleGetStarted = (sender_psid) =>{
    return new Promise(async (resolve, reject) => {
        try{
            
            let fullname = await getInfoProfile(sender_psid, 'full_name');
            
            
            
            mysqlConfig.query("SELECT * FROM tbl_chat order by id asc limit 2", function (err, result, fields) {

                for (let index = 0; index < result.length; index++) {
                   
                var content = result[index].content
                content = content.replace('@name', fullname)
                let response = { "text": `${content}! `}
                //
                callSendAPI(sender_psid, response);
                 sleep(2000);
                }
                
            });
            
           
        
            
          
            // let response0 = { "text":  `Cô Mèo sẽ giải đáp các thắc mắc của các bạn về thông tin của trường và các biểu mẫu tài liệu ! `}
        
            // await callSendAPI(sender_psid, response0);
            
            let response2 = getStarted_menu();
            await callSendAPI(sender_psid, response2);

        }catch(e){
            reject(e);
        }
    })

}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  
let getStarted_menu = () =>{
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Menu chức năng của Cô Mèo nè ><!!",
                    "subtitle": "Tap để chọn chức năng",
                    "image_url": "https://img.freepik.com/free-vector/cute-cat-teacher-with-chalkboard-cartoon-mascot_357749-761.jpg",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Hướng Dẫn",
                            "payload": "HUONG_DAN",
                        },
                        {
                            "type": "postback",
                            "title": "DS Chức Năng",
                            "payload": "CHUC_NANG",
                        }
                        // ,
                        // {
                        //     "type":"web_url",
                        //     "url": `${URL_WEBVIEW_DK}`,
                        //     "title": "Đăng ký tư vấn",
                        //     "webview_height_ratio": "tall",
                        //     "messenger_extensions": "true"
                        // }
                    ],
                }]
            }
        }
    }
    return response;
}
 let thongtintuyensinh = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Thông tin tuyển sinh",
                    "subtitle": "Tap để chọn ",
                    "image_url": "",
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
                }]
            }
        }
    }
    return response;
 }

module.exports = {
    handleGetStarted : handleGetStarted,
    getInfoProfile : getInfoProfile

}
