const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const indexRoute = require("./routes/indexRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();

// settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const DbConnect = async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("connected");
}

DbConnect().catch(err => console.log(err));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_crecret: process.env.CLOUDINARY_API_SECRET
})

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
app.use((req, res, next) => {
    if (req.session.user) {
        app.locals.user_logged_id = req.session.user.id;
        app.locals.user_logged_name = req.session.user.name;
    }
    next();
});
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const uploadDir = path.join(__dirname, "public", "upload", "temp");

        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true })

        cb(null, uploadDir);
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
