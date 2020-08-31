const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();

const indexRoute = require("./routes/indexRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();

// settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const uri = process.env.DB_URI;

const DbConnect = async () => {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("connected");
}

DbConnect().catch(err => console.log(err));

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("trust proxy", 1);
app.use(session({
    secret: "secret-key",
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
app.use((req, res, next) => {
    app.locals.success_message = req.flash("success_message")[0];
    app.locals.error_message = req.flash("error_message")[0];
    next();
});
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "public", "upload", "img");
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + uniqueSuffix + ext);
    }
});
app.use(multer({
    storage: diskStorage,
    fileFilter: (req, file, cb) => {
        const extentions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
        let isValid = false;
        const fileExt = path.extname(file.originalname);
        extentions.forEach(e => {
            if (e == fileExt) {
                isValid = true;
            }
        });
        if (isValid) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}).fields([
    {
        name: "file", maxCount: 8
    }
]));

// routes
app.use("/", indexRoute);
app.use("/admin", adminRoute);

// static files
app.use("/public", express.static(path.join(__dirname, "public")));

module.exports = app;
