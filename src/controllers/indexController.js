const path = require("path");
const fs = require("fs");

const fileJson = path.join(__dirname, "../db.json");

const index = (req, res) => {

    const db = fs.readFileSync(fileJson, 'utf-8');
    const data = JSON.parse(db);

    const business = [];

    let count = 0;
    data.business.forEach(b => {

        if (count < 5) {
            business.push(b);
        }

        count++;

    });

    res.render("index", { title: 'Home', business: business });
}

const about = (req, res) => {

    const db = fs.readFileSync(fileJson, 'utf-8');
    const data = JSON.parse(db);

    res.render("about", { title: "About", employees: data.employees });
}

const contact = (req, res) => {
    res.render("contact", { title: "Contact" });
}

const training = (req, res) => {
    res.render("training", { title: "Training" });
}

const downloadDocs = (req, res) => {
    res.download(path.join(__dirname, "../public/files/solicitud.docx"));
}

const services = (req, res) => {

    const db = fs.readFileSync(fileJson, 'utf-8');
    const data = JSON.parse(db);
 
    res.render("services", { title: "Services", services: data.services });
}

const business = (req, res) => {

    const db = fs.readFileSync(fileJson, 'utf-8');
    const data = JSON.parse(db);

    res.render("business", { title: "Business", business: data.business });
}

const businessDetails = (req, res) => {

    const db = fs.readFileSync(fileJson, 'utf-8');
    const data = JSON.parse(db);
    const { id } = req.params;

    let business = null;

    data.business.forEach(b => {
        // "b" es una empresa de la collecion de empresas
        if (b.id == parseInt(id)) {
            business = b;
        }

    });

    res.render("businessDetails", { title: "Business Details", data: business });
}

const news = (req, res) => {
    res.render("news", { title: "News" });
}

module.exports = {
    index: index,
    about: about,
    contact: contact,
    training: training,
    downloadDocs: downloadDocs,
    services: services,
    business: business,
    businessDetails: businessDetails,
    news: news,
};
