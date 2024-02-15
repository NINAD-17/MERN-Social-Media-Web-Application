// For Authorization.
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); // From req we're grabbing authorization header that's where the token will be set on frontend. In frontend it's set and in backend we grab it.

        if(!token) return res.status(403).send("Access Denied");

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length()).trimLeft(); // As token is placed after Bearer we take right side of token by trimming it. So we get actual token
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        next(); // In middleware, next() is important to put. to move on next step/middleware of the program
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}