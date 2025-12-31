const app =require('./app');
require("dotenv").config()
const ConnectDB =require("./src/db/db")

ConnectDB()

app.listen(3000,()=>{

    console.log("server is running on port 3000")
})

