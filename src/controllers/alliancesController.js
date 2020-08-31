const path = require("path");
const fs = require("fs");

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
    let imgPath = "";

    if (req.files.file)
        imgPath = "/public/upload/img/" + req.files.file[0].filename;

    const newAlliance = {
        name: name,
        description: description,
        imgPath: imgPath
    };

    const alliance = new Alliance(newAlliance);
    await alliance.save();

    res.redirect("/admin/alliances");
}

const updateAlliance = async (req, res) => {
    const { id } = req.params;
    let alliance = await Alliance.findById(id);
    res.render("admin/alliances/update", { title: "Delete alliance", data: alliance });
}

const confirmUpdateAlliance = async (req, res) => {
    const { id, name, description } = req.body;
    let alliance = await Alliance.findById(id);

    if (req.files.file) {
        if (alliance.imgPath != "")
            if (fs.existsSync(path.join(__dirname, "..", alliance.imgPath)))
                fs.unlinkSync(path.join(__dirname, "..", alliance.imgPath));

        alliance.imgPath = "/public/upload/img/" + req.files.file[0].filename;
    }

    alliance.name = name;
    alliance.description = description;
    
    await Alliance.updateOne({
        _id: id
    }, alliance);

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
        if (fs.existsSync(path.join(__dirname, "..", alliance.imgPath)))
            fs.unlinkSync(path.join(__dirname, "..", alliance.imgPath));

    await Alliance.deleteOne({ _id: id });

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
