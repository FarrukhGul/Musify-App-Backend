const jwt = require('jsonwebtoken');

function getToken(req) {
    return req.headers.authorization?.split(' ')[1]; // Bearer <token>
}

async function authArtist(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "artist") return res.status(403).json({ message: "Artists only" });
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

async function authUser(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "user") return res.status(403).json({ message: "Users only" });
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

async function authAny(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { authArtist, authUser, authAny };