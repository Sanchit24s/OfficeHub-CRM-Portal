const otpGenerator = require('otp-generator');
const UserModel = require('../models/user');


function generateOTP () {
    const OTP = otpGenerator.generate(6, 
                    { 
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false, 
                        specialChars: false 
                    });

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
                    
    return { OTP, expirationTime };
} 


module.exports = { generateOTP  };