const path = require("path");
const fs = require("fs");

const Business = require("../models/Business");

const getBusiness = async (req, res) => {

    const businesses = await Business.find();

    res.render("admin/business/list", { title: "Business list", data: businesses });
}

const getBusinessById = async (req, res) => {
  
    const { id } = req.params;
    const business = await Business.findById(id);

    res.render("admin/business/details", { title: "Business Details", data: business });
}

const addBusiness = (req, res) => {
    res.render("admin/business/add", { title: "Add business" });
}

const confirmAddBusiness = async (req, res) => {
    const { businessName, own, fundationYear, description } = req.body;
    const { file } = req.files;
    let imgPath = "";

    if (file)
        imgPath = "/public/upload/img/" + file[0].filename;

    const newBusiness = {
        name: businessName,
        own: own,
        yearFundation: fundationYear,
        description: description,
        imgPath: imgPath
    };

    const business = new Business(newBusiness);
    await business.save();

    res.redirect("/admin/business/add");
}

const updateBusiness = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);
  
    res.render("admin/business/update", { title: "Business Details", data: business });
}

const confirmUpdateBusiness = async (req, res) => {
    const { id, businessName, description, own, fundationYear } = req.body;

    let business = await Business.findById(id);

    if (req.files.file) {
        if (business.imgPath != "") {
            if (fs.existsSync(path.join(__dirname, "..", business.imgPath))) {
                const url = path.join(__dirname, ".." + business.imgPath);
                fs.unlinkSync(url);
            }
        }
        business.imgPath = "/public/upload/img/" + req.files.file[0].filename;
    }

    business.name = businessName;
    business.own = own;
    business.description = description;
    business.fundation = fundationYear;

    await Business.updateOne({
        _id: id
    }, business);

    res.redirect("/admin/business");
}

const deleteBusiness = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);

    res.render("admin/business/delete", { title: "Delete business", data: business });
}

const confirmDeleteBusiness = async (req, res) => {
    const { id } = req.params;
    let business = await Business.findById(id);

    if (business.imgPath != "")
        if (fs.existsSync(path.join(__dirname, "..", business.imgPath)))
            fs.unlinkSync(path.join(__dirname, ".." + business.imgPath));
        
    await Business.deleteOne({ _id: id});

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
