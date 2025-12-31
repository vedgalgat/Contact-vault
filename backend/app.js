const express = require('express');
const cookieParser = require('cookie-parser');
const cors=require('cors');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ['https://contact-vault-kappa.vercel.app','http://localhost:5173'], // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies to be sent  
     
}));

/* test route */
app.get("/", (req, res) => {
  res.send("Backend is running");
});
// Import user routes
const userRoutes = require('./src/router/user.route');
const authRoutes = require('./src/router/post.router');
const ContactRoutes = require('./src/router/users.contact.routes'); 

app.use('/api/users', userRoutes);

app.use("/api/post",authRoutes)
app.use("/api/contacts", ContactRoutes);

module.exports = app;