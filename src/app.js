const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const indexRoute = require("./routes/indexRoute");
const adminRote = require("./routes/adminRoute");

const app = express();

// settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

// routes
app.use("/", indexRoute);
app.use("/admin", adminRote);

// static files
app.use("/public", express.static(path.join(__dirname, "public")));

module.exports = app;
