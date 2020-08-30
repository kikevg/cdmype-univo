const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const jsonFile = path.join(__dirname, "../db.json");

const readJsonFileForUsers = () => {
    return JSON.parse(fs.readFileSync(jsonFile, "utf-8")).users;
}

const login = (req, res) => {
    res.render("admin/login");
}

const verifyLogin = (req, res) => {
    const users = readJsonFileForUsers();
    const { username, password } = req.body;
    let user = null;
    users.forEach(us => {
        if (us.username == username) {
            user = us;
        }
    });
    if (!user) {
        req.flash("error_message", "El usuario no existe");
        res.redirect("/admin");
    } else {
        bcrypt.compare(password, user.password, (err, same) => {
            if (err) {
                console.logo("Error: " + err);
            } else {
                if (same) {
                    req.session.user = {
                        id: user.id,
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
