const jwt = require("jsonwebtoken");
const process = require("process");

function authorization (req, res, next) {
    console.log("Auth headers:", req.headers)

    const bearerHeader = req.headers.authorization;
    
    if  (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];
            console.log("Extracted token:", token);

            try {
                //Verifying the token
                const user = jwt.verify(token, process.env.JWT);
                console.log("JWT secret:", process.env.JWT)
                req.user = user;
                console.log("Middleware req.user:", req.user)
                next();
            } catch (err) {
                console.log("Token verification error:", err.message);
                if (err.name === "TokenExpiredError") {
                    return res.status(403).send("Token has expired.")
                } else if (err.name === "JsonWebTokenError") {
                    return res.status(403).send("Token is invalid.");
                }
                return res.status(403).send("Failed to authenticate token.")
            }
        } else {

            return res.status(401).send("No token provided.")
        }
    }

module.exports = authorization;
