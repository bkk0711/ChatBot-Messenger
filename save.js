// let q_payload = received_message.quick_reply.payload;

    
    // // Set the response based on the postback payload
    // switch(q_payload){
    //     case 'PT1':
    //         await sender_action(sender_psid);
    //         let c1 = {"text": "*Sử dụng kết quả học bạ THPT* \n Cách 1 : Điểm xét tuyển bằng tổng điểm trung bình lớp 10 11 và học kì 1 lớp 12 của 3 môn trong tổ hợp môn xét tuyển đạt từ 18 điểm trở lên ( làm tròn đến số thập phân thứ 2 )"}
    //         await callSendAPI(sender_psid, c1);
    //         await sender_action(sender_psid);
    //         let c2 = {"text": "*Sử dụng kết quả học bạ THPT* \n Cách 2 : Điểm xét tuyển bằng tổng điểm trung bình cả năm lớp 12 của 3 môn trong tổ hợp môn xét tuyển từ 18 điểm trở lên ( làm tròn đến số thập phân thứ 2 )",
    //         "quick_replies":[
    //             {
    //               "content_type":"text",
    //               "title":"Tính điểm cách 1",
    //               "payload":"TDC1"
    //             },{
    //                 "content_type":"text",
    //                 "title":"Tính điểm cách 2",
    //                 "payload":"TDC2"
    //               },
    //               {
    //                 "content_type":"text",
    //                 "title":"Hướng dẫn xét tuyển",
    //                 "payload":"HD_PT1"
    //               }
    //           ]}
    //         await callSendQickReplies(sender_psid, c2);
    //         break;
    //     case 'PT2':
    //         await sender_action(sender_psid);
    //         response = { "text": "*Xét tuyển kết quả kỳ thi tốt nghiệp THPT 2021* \n Điểm xét tuyển bằng tổng điểm ba môn thi tốt nghiệp THPT trong tổ hợp xét tuyển công điểm ưu tiên khu vực, đối tượng " }
    //         break;
    //     case 'PT3':
    //         await sender_action(sender_psid);
    //         response = { "text": "*Xét tuyển Sử dụng kết quả thi đánh giá năng lực 2021 do ĐH Quốc gia Hồ Chí Minh tổ chức * \n Điểm xét tuyển là điểm bài thi đánh giá năng lực từ 600 điểm trở lên" }
          
    //         break;
    //     case 'PT4':
    //         await sender_action(sender_psid);
    //         response = { "text": "*Tuyển thẳng theo quy định Bộ Giáo dục và Đào tạo* \n Tuyển thẳng thí sinh đạt giải kỳ thi cấp quốc gia, quốc tế, học sinh có học lực lớp 10, 11, 12 đạt loại khá và hạnh kiểm xếp loại tốt trở lên" }
          
    //         break;  
    //     case 'HD_PT1':
    //         response = {
    //             "attachment":{
    //                 "type":"image", 
    //                 "payload":{
    //                   "url":"https://tuyensinh.ctuet.edu.vn/media/o1XF_nz7qYOroCmv_Rmo41XrYyCKNTarek3c1xnmGY0SHrW6nUZ0FMIzPcUFC8J-Tq6WELjIy2CUGzSz2fB_u9KSRna4NoXpImzi2y7fFsw.jpg"
    //                 }
    //               }
    //         }
    //         break;
    //         default:
               
    // }
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
            