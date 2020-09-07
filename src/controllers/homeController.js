
const Service = require("../models/Service");
const Alliance = require("../models/Alliance");
const Business = require("../models/Business");

const home = async (req, res) => {

    const totalServices = (await Service.find()).length;
    const totalAlliances = (await Alliance.find()).length;
    const totalBusiness = (await Business.find()).length;

    res.render("admin/home", { title: "Inicio", totalServices, totalAlliances, totalBusiness });
}

module.exports = {
    home: home
};
