"use strict";
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
var urlencode = require('urlencode');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(location, slotDate, slotTime, toEmail) {
    var htmlMessage = `You are receiving this email as you have registered yourself for VFS alerts. <br />
    Earliest Slot available for ${location} is ${slotDate} at ${slotTime}`;

    const message = {
      to: toEmail,
      from: process.env.SENDER_EMAIL,
      subject: "codyPrashant - VFS alerts",
      html: htmlMessage,
    };

    console.log("Sending email Alert")
    return sgMail.send(message);

}

async function sendErrorEmail(location, slotDate, slotTime, toEmail, error) {
  var htmlMessage = `You are receiving this email as you have registered yourself for VFS alerts. <br />
  Earliest Slot available for ${location} is ${slotDate} at ${slotTime} <br />
  
  We have got error while generating email for this alert with below error<br />
  ${error}`;

  const message = {
    to: toEmail,
    from: process.env.SENDER_EMAIL,
    subject: "codyPrashant - VFS alerts",
    html: htmlMessage,
  };

  console.log("Sending email error Alert")
  return sgMail.send(message);

}

async function getFormattedDate(){
  let date = new Date();
  let day = date.getUTCDate()
  let month = date.getUTCMonth() + 1
  let year = date.getUTCFullYear()

  if(day < 9){
      day = `0${day}`
  }
  if(month < 9){
    month = `0${month}`
}
  let formattedDate = urlencode(`${day}/${month}/${year}`)
  return formattedDate;
}

module.exports = { sendEmail, getFormattedDate, sendErrorEmail };
