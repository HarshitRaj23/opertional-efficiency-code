// jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

// Setting up Express middleware
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up session and passport
app.use(session({
    secret:"our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect("mongodb+srv://Admin-Neural-Brainiacs:Test12345@cluster0.8moz4.mongodb.net/userDB");

// Define schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

// Passport configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", function(req, res) {
    res.render("index");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/home", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        res.redirect("/login");
    }
});

app.get("/biDashboard", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("biDashboard");
    } else {
        res.redirect("/login");
    }
});

app.get("/about", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("about");
    } else {
        res.redirect("/login");
    }
});

app.get("/teams", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("teams");
    } else {
        res.redirect("/teams");
    }
});

app.get("/logout", function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
});

app.post("/register", function(req, res) {
    User.register({ username: req.body.username }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/home");
            });
        }
    });
});

app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/home");
            });
        }
    });
});

app.listen(process.env.PORT || 3000 , function() {
    console.log("Server started on port 3000.");
});
