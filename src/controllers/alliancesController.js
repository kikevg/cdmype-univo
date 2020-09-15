const cloudinary = require("cloudinary").v2;

const Alliance = require("../models/Alliance");

const getAlliances = async (req, res) => {
    const alliancesList = await Alliance.find();
    res.render("admin/alliances/list", { title: "Lista de alianzas", data: alliancesList });
}

const getAlliancesById = async (req, res) => {
    const { id } = req.params;
    let alliance = await Alliance.findById(id);

    res.render("admin/alliances/details", { title: "Detalles de alizan", data: alliance });
}

const addAlliance = (req, res) => {
    res.render("admin/alliances/add", { title: "Agregar alianza" });
}

const confirmAddAlliance = async (req, res) => {
    const { name, description } = req.body;
    const { file } = req.files;

    if (name == "" && file == undefined) {
        req.flash("error_message", "Rellena todos los campos necesarios");
        res.redirect("/admin/alliances/add");
        return;
    }

    let url = "";

    if (file) {
        try {

            const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
            url = cloudinaryRespose.url;

        } catch (err) {

            req.flash("error_message", erro);
            res.redirect("admin/alliances/add");

        }
    }

    const newAlliance = {
        name: name,
        description: description,
        imgPath: url
    };

    const alliance = new Alliance(newAlliance);
    await alliance.save();

    req.flash("success_message", "Datos agregados exitosamente");

    res.redirect("/admin/alliances/add");
}

const updateAlliance = async (req, res) => {
    const { id } = req.params;
    let alliance = await Alliance.findById(id);
    res.render("admin/alliances/update", { title: "Editar alianza", data: alliance });
}

const confirmUpdateAlliance = async (req, res) => {
    const { id, name, description } = req.body;
    const { file } = req.files;

    if (name == "") {
        req.flash("error_message", "Rellean todos los campos necesarios");
        res.redirect("/admin/alliances/update/" + id);
        return;
    }

    let alliance = await Alliance.findById(id);

    if (file) {

        try {

            const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
            await cloudinary.uploader.destroy(alliance.imgPath.split("/").pop().split(".")[0]);
            alliance.imgPath = cloudinaryRespose.url;

        } catch (error) {

            req.flash("error_message", error);
            req.redirect("/admin/alliances/update/" + id);

        }
        
    }

    alliance.name = name;
    alliance.description = description;
    
    await Alliance.updateOne({
        _id: id
    }, alliance);

    req.flash("success_message", "Datos actualizados exitosamente");

    res.redirect("/admin/alliances");
}

const deleteAlliance = async (req, res) => {
    const { id } = req.body;
    let alliance = await Alliance.findById(id);

    if (alliance.imgPath != "")

        try {
            await cloudinary.uploader.destroy(alliance.imgPath.split("/").pop().split(".")[0]);
        } catch (err) {
            req.flash("error_message", err);
            req.redirect("/admin/alliances/delete/" + id);
        }

    await Alliance.deleteOne({ _id: id });

    req.flash("success_message", "Datos eliminados exitosamente");

    res.redirect("/admin/alliances");
}

module.exports = {
    getAlliances: getAlliances,
    getAlliancesById: getAlliancesById,
    addAlliance: addAlliance,
    confirmAddAlliance: confirmAddAlliance,
    updateAlliance: updateAlliance,
    confirmUpdateAlliance: confirmUpdateAlliance,
    deleteAlliance: deleteAlliance,
}
