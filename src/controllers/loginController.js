const bcrypt = require("bcrypt");

const User = require("../models/User");

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
        bcrypt.compare(password, user.password, (err, same) => {
            if (err) {
                console.log("Error: " + err);
            } else {
                if (same) {
                    req.session.user = {
                        id: user._id,
                        name: user.name
                    };
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

const logout = (req, res) => {
    if (req.session.user) {
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
