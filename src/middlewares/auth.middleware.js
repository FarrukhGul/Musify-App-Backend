const jwt = require('jsonwebtoken');

async function authArtist(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized..." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "artist") {
            return res.status(403).json({ message: "You don't have access to this resource..." });
        };

        req.user = decoded; 
        
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized Access..." });
    }
}

async function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized..." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "user") {
            return res.status(403).json({ message: "You don't have access to this resource..." });
        };

        req.user = decoded; 
        
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized Access..." });
    }
}

// NEW: Allow both users and artists to access
async function authAny(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Any authenticated user (both user and artist) can access
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = { authArtist, authUser, authAny };