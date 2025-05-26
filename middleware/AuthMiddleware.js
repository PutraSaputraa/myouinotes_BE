import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or invalid authorization header" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // 2. Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err.message);
                
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({ message: "Token expired" });
                }
                if (err.name === "JsonWebTokenError") {
                    return res.status(403).json({ message: "Invalid token" });
                }
                
                return res.status(403).json({ message: "Failed to authenticate token" });
            }

            // 3. Attach user data to request
            req.user = {
                userId: decoded.userId,
                username: decoded.username,
                email: decoded.email || decoded.mail // Handle both 'email' and 'mail' claims
            };
            
            next();
        });
    } catch (error) {
        console.error("Authentication middleware error:", error);
        return res.status(500).json({ message: "Internal server error during authentication" });
    }
};