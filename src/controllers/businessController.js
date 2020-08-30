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

const getBusiness = (req, res) => {
    const businessList = readJsonFile().business;
    res.render("admin/business/list", { title: "Business list", data: businessList });
}

const getBusinessById = (req, res) => {
    const businessList = readJsonFile().business;
    const { id } = req.params;
    let business = null;
    businessList.forEach(bus => bus.id == id ? business = bus : null);
    res.render("admin/business/details", { title: "Business Details", data: business });
}

const addBusiness = (req, res) => {
    res.render("admin/business/add", { title: "Add business" });
}

const confirmAddBusiness = (req, res) => {
    let json = readJsonFile();
    const { businessName, own, fundationYear, description } = req.body;
    const { file } = req.files;
    const newBusiness = {
        id: uuid(),
        name: businessName,
        own: own,
        fundation: fundationYear,
        description: description,
        imgPath: "/public/upload/img/" + file[0].filename
    };
    json.business.push(newBusiness);
    writeJsonFile(json);
    res.redirect("/admin/business/add");
}

const updateBusiness = (req, res) => {
    const businessList = readJsonFile().business;
    const { id } = req.params;
    let business = null;
    businessList.forEach(bus => bus.id == id ? business = bus : null);
    res.render("admin/business/update", { title: "Business Details", data: business });
}

const confirmUpdateBusiness = (req, res) => {
    const json = readJsonFile();
    const { id, businessName, description, own, fundationYear } = req.body;
    let business = null;
    json.business.forEach(bus => bus.id == id ? business = bus : null);
    if (req.files) {
        const url = path.join(__dirname, ".." + business.imgPath);
        fs.unlinkSync(url);
        business.imgPath = "/public/upload/img/" + req.files.file[0].filename;
    }
    business.name = businessName;
    business.own = own;
    business.description = description;
    business.fundation = fundationYear;
    writeJsonFile(json);
    res.redirect("/admin/business");
}

const deleteBusiness = (req, res) => {
    const businessList = readJsonFile().business;
    const { id } = req.params;
    let business = null;
    businessList.forEach(bus => bus.id == id ? business = bus : null);
    res.render("admin/business/delete", { title: "Delete business", data: business });
}

const confirmDeleteBusiness = (req, res) => {
    const json = readJsonFile();
    const { id } = req.params;
    let business = [];
    json.business.forEach(bus => {
        if (bus.id != id)
            business.push(bus)
        else
            fs.unlinkSync(path.join(__dirname, ".." + bus.imgPath));
    });
    json.business = business;
    writeJsonFile(json);
    res.redirect("/admin/business");
}

module.exports = {
    getBusiness, getBusiness,
    getBusinessById, getBusinessById,
    addBusiness, addBusiness,
    confirmAddBusiness, confirmAddBusiness,
    updateBusiness, updateBusiness,
    confirmUpdateBusiness, confirmUpdateBusiness,
    deleteBusiness, deleteBusiness,
    confirmDeleteBusiness, confirmDeleteBusiness,
};
