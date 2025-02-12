const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log("Auth middleware triggered");

    if (!req.session.authorization) {
        console.log("No authorization found in session");
        return res.status(403).json({ message: "User not logged in" });
    }

    let token = req.session.authorization.token;
    jwt.verify(token, "secret_key", (err, decoded) => {
        if (err) {
            console.log("JWT verification failed", err);
            return res.status(403).json({ message: "Invalid token" });
        }
        console.log("User authenticated:", decoded.username);
        req.user = decoded.username; // Attach user to request
        next();
    });
});

 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
