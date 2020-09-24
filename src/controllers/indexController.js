const path = require("path");

const Business = require("../models/Business");
const Alliance = require("../models/Alliance");
const Service = require("../models/Service");
const Employee = require("../models/Employee");
const News = require("../models/News");
const Carousel = require("../models/Carousel");

const index = async (req, res) => {

    const businessTotal = (await Business.find()).length;
    const alliancesTotal = (await Alliance.find()).length;
    const servicesTotal = (await Service.find()).length;

    const alliancesList = await Alliance.find();
    const businesses = await Business.find();
    const carouselImages = await Carousel.find();

    let businessList = [];

    for (let i = 0; i < businesses.length; i++)
        if (i < 5)
            businessList.push(businesses[i]);

    res.render("index", {
        title: 'Inicio', images: carouselImages, businessList: businessList, alliancesList: alliancesList, data: {
            businessTotal,
            alliancesTotal,
            servicesTotal
        }
    });
}

const about = async (req, res) => {

    const employees = await Employee.find();

    res.render("about", { title: "Nosotros", employees: employees });
}

const center = async (req, res) => {
    res.render("center", { title: "Centro emprendedor" });
}

const incubator = (req, res) => {
    res.render("incubator", { title: "Incubadora de empresas" });
}

const contact = (req, res) => {
    res.render("contact", { title: "Contacto" });
}

const training = (req, res) => {
    res.render("training", { title: "Asesoria" });
}

const downloadDocs = (req, res) => {
    res.download(path.join(__dirname, "../public/files/solicitud.docx"));
}

const services = async (req, res) => {

    const servicesList = await Service.find();

    res.render("services", { title: "Servicios", services: servicesList });
}

const business = async (req, res) => {

    const businessList = await Business.find();

    res.render("business", { title: "Empresas", business: businessList });
}

const businessDetails = async (req, res) => {
    const { id } = req.params;
    let business = await Business.findById(id);
    res.render("businessDetails", { title: "Detalles de empresa", data: business });
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

    res.render("news", { title: "Noticias", data: result, categories: categories, latestNews: latestNews, pagination: news.length });
}

const newsDetails = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);

    const newsList = await News.find();

    let latestNews = [];
    let randomNews = [];

    let newsLength = (newsList.length > 3) ? 3 : newsList.length;

    for (let i = 1; i <= newsLength; i++)
        latestNews.push(newsList[newsList.length - i]);

    for (let i = 0; i < 4; i++)
        randomNews.push(newsList[Math.floor(Math.random() * newsList.length)]);

    res.render("newsDetails", { title: "Detalles de noticias", news: news, latestNews: latestNews, randomNews: randomNews });
}

module.exports = {
    index: index,
    about: about,
    center: center,
    incubator: incubator,
    contact: contact,
    training: training,
    downloadDocs: downloadDocs,
    services: services,
    business: business,
    businessDetails: businessDetails,
    news: news,
    newsDetails: newsDetails
};
