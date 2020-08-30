const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const jsonFile = path.join(__dirname, "../db.json");

const readJsonFile = () => {
    return JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
}

const writeJsonFile = (data) => {
    fs.writeFileSync(jsonFile, JSON.stringify(data), "utf-8");
}

const getAlliances = (req, res) => {
    const alliancesList = readJsonFile().alliances;
    res.render("admin/alliances/list", { title: "Alliances list", data: alliancesList });
}

const getAlliancesById = (req, res) => {
    const alliancesList = readJsonFile().alliances;
    const { id } = req.params;
    let alliance = null;
    alliancesList.forEach(a => a.id == id ? alliance = a : null);
    res.render("admin/alliances/details", { title: "Alliances list", data: alliance });
}

const addAlliance = (req, res) => {
    res.render("admin/alliances/add", { title: "Add alliance" });
}

const confirmAddAlliance = (req, res) => {
    const json = readJsonFile();
    const { name, description } = req.body;
    const newAlliance = {
        id: uuid(),
        name: name,
        description: description,
        imgPath: "/public/upload/img/" + req.files.file[0].filename
    };
    json.alliances.push(newAlliance);
    writeJsonFile(json);
    res.redirect("/admin/alliances");
}

const updateAlliance = (req, res) => {
    const alliancesList = readJsonFile().alliances;
    const { id } = req.params;
    let alliance = null;
    alliancesList.forEach(a => a.id == id ? alliance = a : null);
    res.render("admin/alliances/update", { title: "Delete alliance", data: alliance });
}

const confirmUpdateAlliance = (req, res) => {
    const json = readJsonFile();
    const { id, name, description } = req.body;
    let alliance = null;
    json.alliances.forEach(a => a.id == id ? alliance = a : null);
    if (req.file) {
        fs.unlinkSync(path.join(__dirname, "..", alliance.imgPath));
        alliance.imgPath = "/public/upload/img/" + req.files.file[0].filename;
    }
    alliance.name = name;
    alliance.description = description;
    writeJsonFile(json);
    res.redirect("/admin/alliances");
}

const deleteAlliance = (req, res) => {
    const alliancesList = readJsonFile().alliances;
    const { id } = req.params;
    let alliance = null;
    alliancesList.forEach(a => a.id == id ? alliance = a : null);
    res.render("admin/alliances/delete", { title: "Delete alliance", data: alliance });
}

const confirmDeleteAlliance = (req, res) => {
    const json = readJsonFile();
    const { id } = req.params;
    let alliances = [];
    json.alliances.forEach(a => a.id != id ? alliances.push(a) : fs.unlinkSync(path.join(__dirname, "..", a.imgPath)));
    json.alliances = alliances;
    writeJsonFile(json);
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
