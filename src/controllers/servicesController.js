const path = require("path");
const fs = require("fs");

const Service = require("../models/Service");

const jsonFile = path.join(__dirname, "../db.json");

const textColors = [
    "text-success",
    "text-primary",
    "text-danger",
    "text-warning",
    "text-orange"
];

const bgColors = [
    "bg-green",
    "bg-blue",
    "bg-red",
    "bg-yellow",
    "bg-orange"
];

const readJsonFile = () => {
    return JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
}

const writeJsonFile = (data) => {
    fs.writeFileSync(jsonFile, JSON.stringify(data), "utf-8");
}

const getServices = async (req, res) => {
    const servicesList = await Service.find();
    res.render("admin/services/list", { title: "Services list", data: servicesList });
}

const getServicesById = async (req, res) => {
    const { id } = req.params;
    let service = await Service.findById(id);
    res.render("admin/services/details", { title: "Service Details", data: service });
}

const addService = (req, res) => {
    res.render("admin/services/add", { title: "Add service" });
}

const confirmAddService = async (req, res) => {
    const { serviceName, iconService, iconColor, description } = req.body;
    const newService = {
        name: serviceName,
        description: description,
        icon: iconService,
        textColor: textColors[iconColor],
        bgColor: bgColors[iconColor]
    };

    const service = new Service(newService);
    await service.save();

    res.redirect("/admin/services");
}

const updateService = async (req, res) => {
    const { id } = req.params;
    let service = await Service.findById(id);

    let index = null;

    for (let i = 0; i < textColors.length; i++)
        if (service.textColor == textColors[i])
            index = i;
    service.textColor = index;
    res.render("admin/services/update", { title: "Service Details", data: service, colors: textColors });
}

const confirmUpdateService = async (req, res) => {
    const { id, serviceName, iconService, iconColor, description } = req.body;
    let service = await Service.findById(id);

    service.name = serviceName;
    service.description = description;
    service.icon = iconService;
    service.textColor = textColors[iconColor];
    service.bgColor = bgColors[iconColor];

    await Service.updateOne({ _id: id }, service);

    res.redirect("/admin/services");
}

const deleteService = async (req, res) => {
    const { id } = req.params;
    let service = await Service.findById(id);

    res.render("admin/services/delete", { title: "Service Details", data: service });
}

const confirmDeleteService = async (req, res) => {
    const { id } = req.params;
    await Service.deleteOne({ _id: id });
    res.redirect("/admin/services");
}

module.exports = {
    getServices: getServices,
    getServicesById: getServicesById,
    addService: addService,
    confirmAddService: confirmAddService,
    updateService: updateService,
    confirmUpdateService: confirmUpdateService,
    deleteService: deleteService,
    confirmDeleteService: confirmDeleteService
};
