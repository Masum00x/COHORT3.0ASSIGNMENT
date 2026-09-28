import app from "./app.js";
import config from "./src/config/config.js";
import connectDb from "./src/config/db.js";
import cors from 'cors';

const port=config.PORT;
await connectDb();

app.use(cors({
  origin: "*", // Or replace "*" with your future Vercel frontend URL for better security
  credentials: true
}));

app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
})