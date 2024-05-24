const jwt = require('jsonwebtoken');
const secret = "$uperMan@123";

const validateToken = async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "User is not authorized or token is missing" });
    }

    token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "User is not authorized or token is missing" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "User is not authorized" });
    }
}

module.exports = { validateToken };
