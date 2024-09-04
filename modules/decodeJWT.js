const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded; // Attach the decoded token to the req object
        next();
    } catch (e) {
        res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = authenticateToken;