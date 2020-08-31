const path = require("path");

const Business = require("../models/Business");
const Alliance = require("../models/Alliance");
const Service = require("../models/Service");
const Employee = require("../models/Employee");
const News = require("../models/News");

const index = async (req, res) => {

    const businessTotal = (await Business.find()).length;
    const alliancesTotal = (await Alliance.find()).length;
    const servicesTotal = (await Service.find()).length;

    let alliancesList = await Alliance.find();
    let businesses = await Business.find();

    let businessList = [];

    for (let i = 0; i < businesses.length; i++)
        if (i < 5)
            businessList.push(businesses[i]);

    res.render("index", {
        title: 'Home', businessList: businessList, alliancesList: alliancesList, data: {
            businessTotal,
            alliancesTotal,
            servicesTotal
        }
    });
}

const about = async (req, res) => {

    const employees = await Employee.find();

    res.render("about", { title: "About", employees: employees });
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

const services = async (req, res) => {

    const servicesList = await Service.find();

    res.render("services", { title: "Services", services: servicesList });
}

const business = async (req, res) => {

    const businessList = await Business.find();

    res.render("business", { title: "Business", business: businessList });
}

const businessDetails = async (req, res) => {
    const { id } = req.params;
    let business = await Business.findById(id);
    res.render("businessDetails", { title: "Business Details", data: business });
}

const news = async (req, res) => {
    const newsList = await News.find();

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

const newsDetails = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);

    let latestNews = [];
    let randomNews = [];

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
