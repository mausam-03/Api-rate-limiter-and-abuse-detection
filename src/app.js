const express = require('express');
const app = express();
const rateLimiter = require('./middleares/rateLimiter');
const banCheck = require('./middleares/banCheck');
const adminRoutes = require("./routes/admin.routes");

app.use(express.json());
app.use(banCheck); 
app.use(rateLimiter);
app.use("/admin", adminRoutes);

//health check route
app.get('/health', (req,res) => {
    res.json({ message : "rate limiter service runnning" });
})

module.exports = app;