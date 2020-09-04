const cloudinary = require("cloudinary").v2;

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
    let url = "";

    if (file) {
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(file[0].path, { secure: true });
            url = cloudinaryResponse.url;
        } catch (err) {
            throw new Error(err);
        }
    }

    const newBusiness = {
        name: businessName,
        own: own,
        yearFundation: fundationYear,
        description: description,
        imgPath: url
    };

    const business = new Business(newBusiness);
    await business.save();

    req.flash("success_message", "Datos guardados exitosamente");

    res.redirect("/admin/business/add");
}

const updateBusiness = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);

    res.render("admin/business/update", { title: "Business Details", data: business });
}

const confirmUpdateBusiness = async (req, res) => {
    const { id, businessName, description, own, fundationYear } = req.body;
    const { file } = req.files;

    let business = await Business.findById(id);

    if (file) {
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(file[0].path, { secure: true });
            await cloudinary.uploader.destroy(business.imgPath.split("/").pop().split(".")[0]);
            business.imgPath = cloudinaryResponse.url;
        } catch (err) {
            throw new Error(err);
        }
    }

    business.name = businessName;
    business.own = own;
    business.description = description;
    business.fundation = fundationYear;

    await Business.updateOne({
        _id: id
    }, business);

    req.flash("success_message", "Datos actualizados exitosamente");

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
        await cloudinary.uploader.destroy(business.imgPath.split("/").pop().split(".")[0]);

    await Business.deleteOne({ _id: id });

    req.flash("success_message", "Datos eliminados exitosamente");

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
