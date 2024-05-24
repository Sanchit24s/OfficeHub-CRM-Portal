const jwt = require('jsonwebtoken');

const secret = "$uperMan@123";

function createTokenForUser(user) {
    const payLoad = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.firstName + ' '+ user.lastName
    };
    const token = jwt.sign(payLoad, secret, {expiresIn: "2h"});
    return token;
}

function validateToken (token) {
    try {
        const payLoad = jwt.verify(token, secret);
        return payLoad;
    } catch (error) {
        return {message: "Invalid or Expried Token"};
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};