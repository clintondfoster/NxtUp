const jwt = require("jsonwebtoken");
const process = require("process");

function authorization (req, res, next) {
    // console.log("Auth headers:", req.headers)

    const token = req.headers.authorization;
    // console.log("Extracted token:", token)
    
    if (!token) {
        return res.status(401).send("No token provided.");
    }

    try {
        const user = jwt.verify(token, process.env.JWT);
        req.user = user;
        // console.log("Middleware req.user:", req.user)
        next();
    } catch (err) {
        // console.log("Token verification error:", error.message);
        return res.status(403).send("Failed to authenticate token.")
    }
}

module.exports = authorization;