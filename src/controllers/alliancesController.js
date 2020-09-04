const cloudinary = require("cloudinary").v2;

const Alliance = require("../models/Alliance");

const getAlliances = async (req, res) => {
    const alliancesList = await Alliance.find();
    res.render("admin/alliances/list", { title: "Alliances list", data: alliancesList });
}

const getAlliancesById = async (req, res) => {
    const { id } = req.params;
    let alliance = await Alliance.findById(id);

    res.render("admin/alliances/details", { title: "Alliances list", data: alliance });
}

const addAlliance = (req, res) => {
    res.render("admin/alliances/add", { title: "Add alliance" });
}

const confirmAddAlliance = async (req, res) => {
    const { name, description } = req.body;
    const { file } = req.files;

    let url = "";

    if (file) {
        const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
        url = cloudinaryRespose.url;
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
    res.render("admin/alliances/update", { title: "Delete alliance", data: alliance });
}

const confirmUpdateAlliance = async (req, res) => {
    const { id, name, description } = req.body;
    const { file } = req.files;

    let alliance = await Alliance.findById(id);

    if (file) {

        try {

            const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
            await cloudinary.uploader.destroy(alliance.imgPath.split("/").pop().split(".")[0]);
            alliance.imgPath = cloudinaryRespose.url;

        } catch (error) {
            throw new Error(error);
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
    const { id } = req.params;
    let alliance = await Alliance.findById(id);

    res.render("admin/alliances/delete", { title: "Delete alliance", data: alliance });
}

const confirmDeleteAlliance = async (req, res) => {
    const { id } = req.params;
    let alliance = await Alliance.findById(id);

    if (alliance.imgPath != "")

        try {
            await cloudinary.uploader.destroy(alliance.imgPath.split("/").pop().split(".")[0]);
        } catch (err) {
            throw new Error(err);
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
    confirmDeleteAlliance: confirmDeleteAlliance,
}
