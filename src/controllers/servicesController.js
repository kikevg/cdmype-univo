const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

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

const getServices = (req, res) => {
    const servicesList = readJsonFile().services;
    res.render("admin/services/list", { title: "Services list", data: servicesList });
}

const getServicesById = (req, res) => {
    const servicesList = readJsonFile().services;
    const { id } = req.params;
    let service = null;
    servicesList.forEach(s => s.id == id ? service = s : null);
    res.render("admin/services/details", { title: "Service Details", data: service });
}

const addService = (req, res) => {
    res.render("admin/services/add", { title: "Add service" });
}

const confirmAddService = (req, res) => {
    const json = readJsonFile();
    const { serviceName, iconService, iconColor, description } = req.body;
    const newService = {
        id: uuid(),
        name: serviceName,
        description: description,
        icon: iconService,
        textColor: textColors[iconColor],
        bgColor: bgColors[iconColor]
    };
    json.services.push(newService);
    writeJsonFile(json);
    res.redirect("/admin/services");
}

const updateService = (req, res) => {
    const servicesList = readJsonFile().services;
    const { id } = req.params;
    let service = null;
    let index = null;
    servicesList.forEach(s => s.id == id ? service = s : null);
    for (let i = 0; i < textColors.length; i++)
        if (service.textColor == textColors[i])
            index = i;
    service.textColor = index;
    res.render("admin/services/update", { title: "Service Details", data: service, colors: textColors });
}

const confirmUpdateService = (req, res) => {
    const json = readJsonFile();
    const { id, serviceName, iconService, iconColor, description } = req.body;
    let service = null;
    json.services.forEach(s => s.id == id ? service = s : null);
    service.name = serviceName,
    service.description = description,
    service.icon = iconService,
    service.textColor = textColors[iconColor],
    service.bgColor = bgColors[iconColor]
    writeJsonFile(json);
    res.redirect("/admin/services");
}

const deleteService = (req, res) => {
    const servicesList = readJsonFile().services;
    const { id } = req.params;
    let service = null;
    servicesList.forEach(s => s.id == id ? service = s : null);
    res.render("admin/services/delete", { title: "Service Details", data: service });
}

const confirmDeleteService = (req, res) => {
    const json = readJsonFile();
    const { id } = req.params;
    let services = [];
    json.services.forEach(s => s.id != id ? services.push(s) : null);
    json.services = services;
    writeJsonFile(json);
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
