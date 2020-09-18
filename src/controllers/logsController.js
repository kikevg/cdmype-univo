const Log = require("../models/Log");

const index = async (req, res) => {

    const logs = await Log.find();
    const activities = [];
    logs.forEach(l => activities.unshift(l));
    res.render("admin/logs/logs", { title: "Actividad de los usuarios", logs: activities });

}

const getLogsByUser = async (req, res) => {

    const { id } = req.params;
    const logs = await Log.find({ "user.id": id });
    const myActivities = [];
    logs.forEach(l => myActivities.unshift(l));
    res.render("admin/logs/mylogs", { title: "Mi actividad", logs: myActivities });

}

module.exports = {
    index: index,
    getLogsByUser: getLogsByUser
}
