"use strict";
require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Bookingcare.com" <nguyenthanhdat12c@gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: bodyHTML(dataSend),
  });
};

let bodyHTML = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Bookingcare.com</p>
    <p>Thông tin đặt lịch khám bệnh</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

    <p>Nếu các thông tin trên chính xác, vui lòng click vào đường link dưới đây để hoàn tất thủ tục đặt lịch khám bệnh tại bookingcare.com</p>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here ✔</a>
    </div>
    
    <div>Xin chân thành cảm ơn!</div>
  `;
  }

  if (dataSend.language === "en") {
    result = `
    <h3>Hello, ${dataSend.patientName}!</h3>
    <p>You received this email because you booked an online medical appointment on Bookingcare.com</p>
    <p>Information to book a medical appointment</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>

    <p>If the above information is correct, please click on the link below to complete the procedure for booking an appointment at bookingcare.com</p>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here ✔</a>
    </div>
    
    <div>Sincerely thank!</div>
  `;
  }

  return result;
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
};
