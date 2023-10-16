import nodemailer from "nodemailer";
const sendMail = async (email) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_NAME,
    to: email,
    subject: "Nikeshoes",
    text: "Thanks for loggin",
  });
  return info;
};

export default sendMail;
