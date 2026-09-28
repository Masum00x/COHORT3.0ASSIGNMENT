import { verifyAccessToken } from "../utils/auth.utils.js"



const authenticate = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const accessToken = authorization?.startsWith("Bearer ")
            ? authorization.slice(7)
            : null;

        if (!accessToken) {
            return res.status(401).json({
                message: "Access token not found in the request header"
            })
        }

        const decoded = verifyAccessToken(accessToken);
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        })
    }
}

export default authenticate;