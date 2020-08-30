const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { confirmUpdateAlliance } = require("./alliancesController");

const jsonFile = path.join(__dirname, "../db.json");

const readJsonFile = () => {
    return JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
}

const writeJsonFile = (data) => {
    fs.writeFileSync(jsonFile, JSON.stringify(data), "utf-8");
}

const getNews = (req, res) => {
    const newsList = readJsonFile().news;
    let news = [];
    newsList.forEach(n => news.unshift(n));
    res.render("admin/news/list", { title: "News list", data: news });
}

const getNewsById = (req, res) => {
    const newsList = readJsonFile().news;
    const { id } = req.params;
    let news = null;
    newsList.forEach(n => n.id == id ? news = n : null);
    res.render("admin/news/details", { title: "News details", news: news });
}

const addNews = (req, res) => {
    res.render("admin/news/add", { title: "Add news" });
}

const confirmAddNews = (req, res) => {
    const json = readJsonFile();
    const { title, description, category } = req.body;
    let images = [];
    if (req.files)
        req.files.file.forEach(f => images.push("/public/upload/img/" + f.filename))
        
    const news = {
        id: uuid(),
        title: title,
        description: description,
        category: category,
        date: new Date().toDateString() + ", " + new Date().toLocaleTimeString(),
        images: images
    };

    json.news.push(news);
    writeJsonFile(json);
    res.redirect("/admin/news");
}

const updateNews = (req, res) => {
    const newsList = readJsonFile().news;
    const { id } = req.params;
    let news = null;
    newsList.forEach(n => n.id == id ? news = n : null);
    res.render("admin/news/update", { title: "News update", news: news });
}

const confirmUpdateNews = (req, res) => {
    const json = readJsonFile();
    const { id, title, description, category } = req.body;
    let news = null;
    json.news.forEach(n => n.id == id ? news = n : null);

    news.title = title;
    news.category = category;
    news.description = description;

    writeJsonFile(json);

    res.redirect("/admin/news");   
}

const deleteNews = (req, res) => {
    const newsList = readJsonFile().news;
    const { id } = req.params;
    let news = null;
    newsList.forEach(n => n.id == id ? news = n : null);
    res.render("admin/news/delete", { title: "News details", news: news });
}

const confirmDeleteNews = (req, res) => {
    const json = readJsonFile();
    const { id } = req.params;
    let news = [];
    json.news.forEach(n => {
        if (n.id != id)
            news.push(n)
        else {
            n.images.forEach(i => fs.unlinkSync(path.join(__dirname, "..", i)));
        }
    });
    json.news = news;
    writeJsonFile(json);
    res.redirect("/admin/news");
}

module.exports = {
    getNews: getNews,
    getNewsById: getNewsById,
    addNews: addNews,
    confirmAddNews: confirmAddNews,
    updateNews: updateNews,
    confirmUpdateNews: confirmUpdateNews,
    deleteNews: deleteNews,
    confirmDeleteNews: confirmDeleteNews,
};

