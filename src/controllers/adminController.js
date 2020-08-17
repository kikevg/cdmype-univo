const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const fileJson = path.join(__dirname, "../db.json");

const login = (req, res) => {
    res.render("admin/login", { title: "Login", message: req.flash("msg")[0] });
}

const verifyLogin = (req, res) => {

    const { username, password } = req.body;
    const db = fs.readFileSync(fileJson, 'utf-8');
    const data = JSON.parse(db);
    let user = null;

    data.users.forEach(us => {
        if (us.username == username) {
            user = us;
        }
    });

    if (!user) {
        req.flash("msg", "El usuario no existe");
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
                    req.flash("msg", "Datos incorrectos");
                    res.redirect("/admin");
                }
            }
        });
    }
}

const isLogged = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/");
    }
}

const logout = (req, res) => {
    if (req.session.user) {
        delete req.session.user
        res.redirect("/admin");
    }
}

const home = (req, res) => {
    res.render("admin/home", { title: "Home" });
}

module.exports = {
    login: login,
    verifyLogin: verifyLogin,
    isLogged: isLogged,
    logout: logout,
    home: home,
};
