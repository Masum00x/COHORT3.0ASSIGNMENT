import config from "../config/config.js";
import jwt from 'jsonwebtoken'


const generateTokens = ({userId,role})=>{
    const accessToken = jwt.sign({userId,role},config.ACCESSTOKEN,{expiresIn:"15Min"});
    const refreshToken = jwt.sign({userId,role},config.REFRESHTOKEN,{expiresIn:"7Days"});

    return {accessToken,refreshToken};
};


const verifyAccessToken = (token)=>{
    const decoded = jwt.verify("token",token,config.ACCESSTOKEN);
    
    return decoded;
};

const verifyRefreshToken = (token)=>{
    const decoded = jwt.verify("token",token,config.REFRESHTOKEN);

    return decoded;
};

export {generateTokens,verifyAccessToken,verifyRefreshToken};


