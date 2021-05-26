import { response } from "express";
import request from "request"
require('dotenv').config();

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
            console.log(body);
            
            if (!err) {
            body = JSON.parse(body);
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
            //  await sender_action(sender_psid);
            // let fullname = await getInfoProfile(sender_psid, 'full_name');
            // let response = { "text": `Xin chào ${fullname} ! `}
        
            // await callSendAPI(sender_psid, response);
            await sender_action(sender_psid);
            let response0 = { "text": `Xin chào ${fullname} ! \n Cảm ơn bạn đã ghé thăm Fanpage Khoa Công Nghệ Thông Tin | Trường đại học Kỹ thuật - Công nghệ Cần Thơ ! `}
        
            await callSendAPI(sender_psid, response0);
            await sender_action(sender_psid);
            let response2 = getStarted_menu();
            await callSendAPI(sender_psid, response2);

        }catch(e){
            reject(e);
        }
    })

}
let getStarted_menu = () =>{
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Menu chức năng của Chatbot Fanpage Khoa CNTT CTUET",
                    "subtitle": "Tap để chọn chức năng",
                    "image_url": "https://old.ctuet.edu.vn/CSS/MainPage/Image/banner.jpg",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Thông tin tuyển sinh",
                            "payload": "TUYEN_SINH",
                        },
                        {
                            "type":"web_url",
                            "url": `${URL_WEBVIEW_DK}`,
                            "title": "Đăng ký tư vấn",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": "true"
                        }
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
