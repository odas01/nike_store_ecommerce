import moment from 'moment';
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
   },
   tls: {
      rejectUnauthorized: false,
   },
});

export const sendMailOrder = async (email: string) => {
   try {
      await transporter.sendMail({
         from: 'lntthanh3317@gmail.com',
         to: email,
         subject: 'Nike store',
         text: 'Chúng tôi rất vui mừng khi bạn đã tin tưởng và sử dụng sản phẩm của cửa hàng/công ty. Nếu có bất cứ điều gì thắc mắc hoặc cần hỗ trợ, vui lòng phản hồi để chúng tôi biết và giúp bạn có những trải nghiệm tuyệt vời nhất với sản phẩm của chúng tôi',
      });
   } catch (err) {
      console.log(err);
   }
};

export const sendMailForgotPassword = async (
   email: string,
   userId: string,
   token: string
) => {
   await transporter.sendMail({
      from: process.env.EMAIL_NAME,
      to: email,
      subject: 'Reset your password',
      text: `http://localhost:3001/reset-password/${userId}/${token}`,
   });
};
export const sendMultipleEmail = async (
   emails: string[],
   name: string,
   code: string,
   value: string,
   exprire: Date
) => {
   const date = moment(exprire).format('DD/MM YYYY');
   await transporter.sendMail({
      from: process.env.EMAIL_NAME,
      to: emails,
      subject: 'Giảm giá: ' + name,
      html: ` 
      <h2>
      <b>Nike store xin gửi đến quý khách mã giảm giá mới</b> 
      </h2>
      <p>Mã giảm: ${code}</p>
      <p>Giá trị: ${value}</p>
      <p>Ngày hết hạn: ${date} </p>`,
   });
};
