const bcrypt = require("bcrypt");
const moment = require("moment");

const User = require("../models/User");
const Log = require("../models/Log");

const getUsers = async (req, res) => {

    const users = await User.find();
    res.render("admin/users/list", { title: "Lista de usuarios", users: users });

}

const getUserById = async (req, res) => {

    const { id } = req.params;
    const user = await User.findById(id);
    res.render("admin/users/details", { title: "Detalles de usuario", user: user });

}

const addUser = (req, res) => {

    res.render("admin/users/add", { title: "Agregar usuario" });

}

const confirmAddUser = async (req, res) => {

    const { name, email, username, password } = req.body;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, encrypted) => {
        if (err) {
            req.flash("error_message", err.message);
            return res.redirect("/admin/users/add");
        } else {

            const user = new User({
                name: name,
                email: email,
                username: username,
                password: encrypted
            });

            await user.save();

            const log = new Log({
                user: {
                    id: req.session.user.id,
                    name: req.session.user.name
                },
                description: "Agregó un nuevo usuario",
                date: moment().format("DD/MM/YYYY - hh:mm:ss a")
            });
        
            await log.save();

            req.flash("success_message", "Datos guardados satisfactoriamente");
            return res.redirect("/admin/users/add");

        }
    });

}

const profile = async (req, res) => {

    const { id } = req.params;

    const user = await User.findById(id);

    res.render("admin/users/profile", { title: "Perfil", user: user });
}

const config = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    res.render("admin/users/config", { title: "Configuracion", user: user });
}

const updateProfile = async (req, res) => {

    const { profileId, profileName, profileUsername, profileEmail } = req.body;

    let user = await User.findById(profileId);

    user.name = profileName;
    user.username = profileUsername;
    user.email = profileEmail;

    await User.updateOne({ _id: profileId }, user);

    const log = new Log({
        user: {
            id: req.session.user.id,
            name: req.session.user.name
        },
        description: "Editó su perfil",
        date: moment().format("DD/MM/YYYY - hh:mm:ss a")
    });

    await log.save();

    res.redirect("/admin/home");
}

const updatePassword = async (req, res) => {

    const { passId, currentPassword, newPassword, repeatNewPassword } = req.body;
    let user = await User.findById(passId);
    const saltRounds = 10;

    if (newPassword === repeatNewPassword) {
        bcrypt.compare(currentPassword, user.password, (err, same) => {
            if (err) {
                req.flash("error_message", "Hubo un error");
                res.redirect("/admin/users/config/" + user.id);
            } else {
                if (same) {

                    bcrypt.hash(newPassword, saltRounds, async (err, encrypted) => {
                        if (err) {
                            req.flash("error_message", err);
                            res.redirect("/admin/users/config/" + user.id);
                        } else {
                            user.password = encrypted;
                            await User.updateOne({ _id: user.id }, user);

                            const log = new Log({
                                user: {
                                    id: req.session.user.id,
                                    name: req.session.user.name
                                },
                                description: "Editó su contraseña",
                                date: moment().format("DD/MM/YYYY - hh:mm:ss a")
                            });
                        
                            await log.save();

                            res.redirect("/admin/home");
                        }
                    });

                } else {
                    req.flash("error_message", "La contraseña actual no coincide");
                    res.redirect("/admin/users/config/" + user.id);
                }
            }
        });
    } else {
        req.flash("error_message", "Las contraseñas no coinciden");
    }

}

const deleteUser = async (req, res) => {

    const { id } = req.body;
    await User.deleteOne({ _id: id });

    const log = new Log({
        user: {
            id: req.session.user.id,
            name: req.session.user.name
        },
        description: "Eliminó su cuenta",
        date: moment().format("DD/MM/YYYY - hh:mm:ss a")
    });

    await log.save();

    delete req.session.user;

    res.redirect("/admin");

}

module.exports = {
    getUsers: getUsers,
    getUserById: getUserById,
    addUser: addUser,
    confirmAddUser: confirmAddUser,
    profile: profile,
    config: config,
    updateProfile: updateProfile,
    updatePassword: updatePassword,
    deleteUser: deleteUser,
}
