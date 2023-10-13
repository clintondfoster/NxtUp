const jwt = require("jsonwebtoken");
const process = require("process");

function authorization (req, res, next) {
    console.log("Auth headers:", req.headers)

    const token = req.headers.authorization;
    console.log("extracted token:", token)
    
    if  (!token) {
          return res.status(401).send("No token provided")
    }
            try {
                //Verifying the token
                const user = jwt.verify(token, process.env.JWT);
                console.log("JWT secret:", process.env.JWT)
                req.User = user;
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
        } 
    

module.exports = authorization;
