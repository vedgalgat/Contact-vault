const express = require('express');
const router = express.Router();
const {registerUser,loginUser}=require("../controllers/auth.controller");
// const { route } = require('./app');
 

router.post("/register",registerUser)
router.post("/login",loginUser)


module.exports=router;
