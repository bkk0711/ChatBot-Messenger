import { response } from "express";
import request from "request"
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getInfoProfile = (sender_psid, typeif) =>{
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
            console.log('message sent: ' + info)
        } else {
            console.error("Unable to send message:" + err);
        }
    });
    return info;

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
        "uri": "https://graph.facebook.com/v10/me/messages",
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
            let response = { "text": `Chào mừng ${fullname} đến với Khoa Công Nghệ Thông Tin, Trường đại học Kỹ thuật - Công nghệ Cần Thơ` }
            await callSendAPI(sender_psid, response);
        }catch(e){
            reject(e);
        }
    })

}

module.exports = {
    handleGetStarted : handleGetStarted,
    getInfoProfile : getInfoProfile

}
