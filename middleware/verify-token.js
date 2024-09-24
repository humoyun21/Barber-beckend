const jwt = require("jsonwebtoken");

const verifyToken = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization;
        if(!token) return res.status(401).json({
            message: "Unauthorized"
        })

        try{
            const tokenData = token.split(" ")[1];
            jwt.verify(tokenData, process.env.JWT_SECRET, (err, decoded) => {
                if(err) return res.status(403).json({
                    message: "Token is not valid"
                })

                if(typeof decoded !== "object" || decoded === null){
                    return res.status(403).json({ message: "Invalid token payload" });
                }

                if(!roles.includes(decoded.role)){
                    return res.status(403).json({ message: "Your role doesn't support this operation" });
                }
                
                req.user = decoded;

                next()          
            })
        }
        catch(error){
            res.json({
                message: error
            })
        }

    }
}

module.exports = verifyToken