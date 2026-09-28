import express from 'express'
import userRoutes from './src/routes/user.routes.js'
import productRoutes from './src/routes/product.routes.js'
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Ok got it...")
})

app.use("/api/auth",userRoutes);
app.use("/api/products", productRoutes)

export default app;