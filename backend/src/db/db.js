    const mongoose =require("mongoose")

    function ConnectDB(){
        mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
            console.log("Database is connected")

        })
        .catch(err=>{
            console.log(err)
        })
    }

    module.exports=ConnectDB