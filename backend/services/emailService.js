const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  // port: 587,
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

async function sendOTP(email, otp) {
  try {
    const mailOptions = {
      from: {
        name: 'Sanchit',
        address: process.env.EMAIL
      },
      to: email,
      subject: 'Your OTP Code',
      text: `Dear User,\n\n` +
        `Your One Time Password (OTP) is: ${otp}\n\n` +
        `Please use this OTP to complete your action.\n\n` +
        `This OTP will expire in 5 minutes.\n\n` +
        `Thank you,\n` +
        `Sanchit`,
    };

    await transporter.sendMail(mailOptions);
    return 'OTP sent successfully';
  } catch (error) {
    throw error;
  }
}

async function sendUserCredentials(email, password, firstName, lastName) {
  try {
    const mailOptions = {
      from: {
        name: 'Sanchit',
        address: process.env.EMAIL
      },
      to: email,
      subject: 'Your Credentials for Company Systems',
      html: `<p>Dear ${firstName} ${lastName},</p>` +
        `<p>Welcome to our team! We're thrilled to have you on board.</p>` +
        `<p>As you begin your journey with us, here are your login credentials for accessing our company systems:</p>` +
        `<p><strong>Username:</strong> ${email}</p>` +
        `<p><strong>Password:</strong> ${password}</p>` +
        `<p>Please keep these credentials secure and do not share them with anyone. They grant access to sensitive information and systems within our organization.</p>` +
        `<p>You can now <a href="http://localhost:4200/auth/login">click here</a> to log in and access the systems.</p>` +
        `<p>If you have any questions or encounter any issues while logging in or accessing our systems, please feel free to reach out to our IT support team for assistance.</p>` +
        `<p>Once again, welcome to [Your Company Name]! We're excited to embark on this journey together and look forward to your valuable contributions.</p>` +
        `<p>Best regards,</p>` +
        `<p>Your Company Name</p>`
    };

    await transporter.sendMail(mailOptions);
    return 'User Credentials sent successfully';
  } catch (error) {
    throw error;
  }
}

async function sendBirthdayEmail(user) {
  try {
    const mailOptions = {
      from: {
        name: 'Sanchit',
        address: process.env.EMAIL
      },
      to: user.email,
      subject: 'Happy Birthday!',
      html: `<p>Dear ${user.firstName},</p>
             <p>We at <strong>[Your Company Name]</strong> would like to wish you a very Happy Birthday! We hope this special day brings you joy, happiness, and everything you desire.</p>
             <p>Thank you for being a valued member of our community. We look forward to celebrating many more birthdays with you.</p>
             <p>Best wishes,</p>
             <p>Sanchit</p>
             <p><strong>[Your Company Name]</strong></p>`
    };
    await transporter.sendMail(mailOptions);
    return 'User BirthdayWish sent successfully';
  } catch (error) {
    throw error;
  }
}

async function sendAnniversaryEmail(user) {
  try {
    const mailOptions = {
      from: {
        name: 'Sanchit',
        address: process.env.EMAIL
      },
      to: user.email,
      subject: 'Happy Anniversarry!',
      html: `<p>Dear ${user.firstName},</p>
            <p>Happy Anniversary!</p>
            <p>We are delighted to celebrate this special occasion with you. Thank you for being a valued member of our community. We hope you have a wonderful day filled with joy and cherished memories.</p>
            <p>Best wishes,</p>
            <p>[Your Company Name]</p>`
    };
    await transporter.sendMail(mailOptions);
    return 'User AnniversaryWish sent successfully';
  } catch (error) {
    throw error;
  }
}

module.exports = { sendOTP, sendUserCredentials, sendBirthdayEmail, sendAnniversaryEmail };
