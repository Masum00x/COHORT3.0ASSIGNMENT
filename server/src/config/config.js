import dotenv from 'dotenv'
dotenv.config()


const config={
    PORT:process.env.PORT||4000,
    ACCESSTOKEN:process.env.JWT_ACCESS_KEY,
    REFRESHTOKEN:process.env.JWT_REFRESH_KEY,
    MONGODB_URI:process.env.MONGODB_URI,
    IMAGEKIT_KEY:process.env.IMAGEKIT_PRIVATE_KEY
}

export default config;