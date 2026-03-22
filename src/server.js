require("dotenv").config();
const app = require("./app");
const   { connectRedis } = require("./config/redis");
const { connectRedis, loadLuaScripts } = require("./config/redis");q

const PORT = process.env.PORT || 3000;

async function startServer(){
    await connectRedis();
    await loadLuaScripts();

    app.listen(PORT, () =>{
        console.log(`server is running on port ${PORT}`);
    });
}

startServer();