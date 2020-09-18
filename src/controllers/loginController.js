const bcrypt = require("bcrypt");
const moment = require("moment");

const User = require("../models/User");
const Log = require("../models/Log");

const login = (req, res) => {
    res.render("admin/login");
}

const verifyLogin = async (req, res) => {

    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        req.flash("error_message", "El usuario no existe");
        res.redirect("/admin");
    } else {
        bcrypt.compare(password, user.password, async (err, same) => {
            if (err) {
                console.log("Error: " + err);
            } else {
                if (same) {
                    req.session.user = {
                        id: user._id,
                        name: user.name
                    };

                    const log = {
                        user: {
                            id: user.id,
                            name: user.name
                        },
                        description: "Inicio de sesion",
                        date: moment().format("DD/MM/YYYY - hh:mm:ss a")
                    };

                    const l = new Log(log);  // l -> log
                    await l.save();

                    res.redirect("/admin/home");
                } else {
                    req.flash("error_message", "Datos incorrectos");
                    res.redirect("/admin");
                }
            }
        });
    }
}

const isLogged = (req, res, next) => {
    if (req.session.user)
        next();
    else
        res.redirect("/admin");
}

const logout = async (req, res) => {
    if (req.session.user) {

        const log = new Log({
            user: {
                id: req.session.user.id,
                name: req.session.user.name
            },
            description: "Finalizó la sesion",
            date: moment().format("DD/MM/YYYY - hh:mm:ss a")
        });

        await log.save();

        delete req.session.user
        res.redirect("/admin");
    }
}

module.exports = {
    loging: login,
    verifyLogin: verifyLogin,
    isLogged: isLogged,
    logout: logout,
};
