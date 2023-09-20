require("dotenv").config();
const nodeMailer = require("nodemailer");

const HTML_TEMPLATE = ({ userName, code, userId }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hope Hive</title>
    <style>
      body {
        padding: 0px;
        margin: 0px;
      }
      a {
        text-decoration: none;
      }
      .brandSection {
        width: 100%;
        background-color: #7c3e66;
        padding: 30px;
        text-align: left;
      }
      .brand {
        width: 70%;
        font-size: 40px;
        color: #f6f2f2;
      }
      .content {
        padding: 5px;
        background-color: #fffaf4 !important;
        color: #530554;
        border: solid #7c3e66;
        font-size: large;
        line-height: 22pt;
      }
      .activate {
        border: none;
        border-radius: 5px;
        padding: 10px;
        background-color: #7c3e66;
        color: #f6f6f6;
        cursor: pointer;
      }
      .activate:hover {
        background-color: #ffe7cc;
        color: #7c3e66;
      }
      .details {
        width: 70%;
        color: #530554;
      }
      .center {
        text-align: center;
      }
      .ContentLabel {
        color: #530554;
        margin-top: 10px;
        font-weight: 900;
        font-size: larger;
      }
      .title{
        color: #f6f6f6;
      }
      td {
        padding: 15px;
      }
    </style>
  </head>

  <body>
    <table>
      <tr>
        <td colspan="3" class="brandSection">
          <h1 class="title">HopeHive</h1>
        </td>
        <td></td>
      </tr>
      <tr>
        <td><label class="ContentLabel" for="content">Content:</label></td>
      </tr>
      <tr>
        <td>
          <p class="content" name="content">
            Hello ${userName},<br />
            You have registered on our website to activate your account, please
            click on the button below.
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="1" class="center">
          <a href="http://localhost:4000/login/${code}/${userId}">
            <button class="activate">Activate Account</button></a
          >
        </td>
      </tr>
    </table>
  </body>
</html>

    
    `;
};

const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // not enable a secure connection when connecting to the SMTP server.
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});
const sendEmail = async (mailDetails, callback) => {
    try {
        const info = await transporter.sendMail(mailDetails);
        callback(info);
    } catch (err) {
        console.log(err);
    }
};
module.exports = async (email, userName, code, userId) => {
    const options = {
        from: `HopeHive < ${process.env.EMAIL} >`, // sender address
        to: email, // receiver email
        subject: "Here we activate your account in HopeHive website",
        html: HTML_TEMPLATE({ userName, code, userId }),
    };
    await sendEmail(options, (info) => {
        console.log(info.messageId);
    });
};
