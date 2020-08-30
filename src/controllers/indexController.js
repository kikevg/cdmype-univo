const path = require("path");
const fs = require("fs");
const { start } = require("repl");

const jsonFile = path.join(__dirname, "../db.json");

const readJsonFile = () => {
    return JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
}

const index = (req, res) => {
    const json = readJsonFile();
    const businessTotal = json.business.length;
    const alliancesTotal = json.alliances.length;
    const servicesTotal = json.services.length;
    let alliancesList = json.alliances;
    let businessList = [];
    for (let i = 0; i < json.business.length; i++)
        if (i < 5)
            businessList.push(json.business[i]);
    res.render("index", {
        title: 'Home', businessList: businessList, alliancesList: alliancesList, data: {
            businessTotal,
            alliancesTotal,
            servicesTotal
        }
    });
}

const about = (req, res) => {
    const employeesList = readJsonFile().employees;
    res.render("about", { title: "About", employees: employeesList });
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
    const servicesList = readJsonFile().services;
    res.render("services", { title: "Services", services: servicesList });
}

const business = (req, res) => {
    const businessList = readJsonFile().business;
    res.render("business", { title: "Business", business: businessList });
}

const businessDetails = (req, res) => {
    const businessList = readJsonFile().business;
    const { id } = req.params;
    let business = null;
    businessList.forEach(b => b.id == id ? business = b : null);
    res.render("businessDetails", { title: "Business Details", data: business });
}

const news = (req, res) => {
    const newsList = readJsonFile().news;
    let news = [];
    let categories = [];
    let latestNews = [];

    let category = req.query.category;

    newsList.forEach(n => {
        if (categories.indexOf(n.category) == -1)
            categories.push(n.category);

        if (category == "all") {
            news.unshift(n);
        } else {
            if (n.category == category) {
                news.unshift(n);
            }
        }
    });

    let newsLength = (newsList.length > 3) ? 3 : newsList.length;
    for (let i = 1; i <= newsLength; i++)
        latestNews.push(newsList[newsList.length - i]);

    let page = req.query.page;
    const limit = 5;

    if (page == undefined)
        page = 1;

    page = parseInt(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const newsResult = news.slice(startIndex, endIndex);

    let a = (news.length > 5) ? news.length : 0;  // longitud de las noticas
    const result = {
        pages: {
            prev: (page - 1 == 0) ? undefined : page - 1,
            next: ((page + 1) > ((parseInt(a / 5) + 1))) ? undefined : page + 1,
            current: page,
            category: category
        },
        news: newsResult
    };

    res.render("news", { title: "News", data: result, categories: categories, latestNews: latestNews, pagination: news.length });
}

const newsDetails = (req, res) => {
    const newsList = readJsonFile().news;
    const { id } = req.params;
    let news = null;
    let latestNews = [];
    let randomNews = [];
    newsList.forEach(n => n.id == id ? news = n : null);

    let newsLength = (newsList.length > 3) ? 3 : newsList.length;
    for (let i = 1; i <= newsLength; i++)
        latestNews.push(newsList[newsList.length - i]);

    for (let i = 0; i < 4; i++)
        randomNews.push(newsList[Math.floor(Math.random() * newsList.length)]);
    res.render("newsDetails", { title: "News details", news: news, latestNews: latestNews, randomNews: randomNews });
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
    newsDetails: newsDetails
};
