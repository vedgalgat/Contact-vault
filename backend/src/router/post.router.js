const express = require('express');

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware"); 

// This is protected route only authenticated user can access this route

router.post("/",authenticateUser)


module.exports=router;  