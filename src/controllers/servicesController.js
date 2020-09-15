const Service = require("../models/Service");

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

const getServices = async (req, res) => {
    const servicesList = await Service.find();
    res.render("admin/services/list", { title: "Lista de servicio", data: servicesList });
}

const getServicesById = async (req, res) => {
    const { id } = req.params;
    let service = await Service.findById(id);

    res.render("admin/services/details", { title: "Detalles de servicio", data: service });
}

const addService = (req, res) => {
    res.render("admin/services/add", { title: "Agregar servicio" });
}

const confirmAddService = async (req, res) => {
    const { serviceName, iconName, description, colorIndex } = req.body;

    const newService = {
        name: serviceName,
        description: description,
        iconName: iconName,
        iconColor: textColors[colorIndex],
        bgColor: bgColors[colorIndex]
    };

    const service = new Service(newService);
    await service.save();

    req.flash("success_message", "Datos agregados exitosamente");

    res.redirect("/admin/services/add");
}

const updateService = async (req, res) => {
    const { id } = req.params;
    let service = await Service.findById(id);

    let index = null;

    for (let i = 0; i < textColors.length; i++)
        if (service.iconColor == textColors[i])
            index = i;
    service.iconColor = index;
    res.render("admin/services/update", { title: "Editar servicio", data: service, colors: textColors });
}

const confirmUpdateService = async (req, res) => {

    const { id, serviceName, iconName, description, colorIndex } = req.body;

    let service = await Service.findById(id);

    service.name = serviceName,
    service.description = description,
    service.iconName = iconName,
    service.iconColor = textColors[colorIndex],
    service.bgColor = bgColors[colorIndex]

    await Service.updateOne({ _id: id }, service);

    req.flash("success_message", "Datos actualizados exitosamente");

    res.redirect("/admin/services");
}

const deleteService = async (req, res) => {
    const { id } = req.body;
    let service = await Service.findById(id);
    await Service.deleteOne({ _id: id });
    req.flash("success_message", "Datos eliminados exitosamente");
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
};
