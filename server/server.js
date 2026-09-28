import app from "./app.js";
import config from "./src/config/config.js";
import connectDb from "./src/config/db.js";

const port=config.PORT;
await connectDb();

app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
})