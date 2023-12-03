import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
   },
});

export const sendMailOrder = async (email: string) => {
   await transporter.sendMail({
      from: process.env.EMAIL_NAME,
      to: email,
      subject: 'Nike store',
      text: 'Chúng tôi rất vui mừng khi bạn đã tin tưởng và sử dụng sản phẩm của cửa hàng/công ty. Nếu có bất cứ điều gì thắc mắc hoặc cần hỗ trợ, vui lòng phản hồi để chúng tôi biết và giúp bạn có những trải nghiệm tuyệt vời nhất với sản phẩm của chúng tôi',
   });
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
