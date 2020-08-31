const path = require("path");
const fs = require("fs");

const News = require("../models/News");

const getNews = async (req, res) => {
    const newsList = await News.find();
    let news = [];
    newsList.forEach(n => news.unshift(n));
    res.render("admin/news/list", { title: "News list", data: news });
}

const getNewsById = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);
    res.render("admin/news/details", { title: "News details", news: news });
}

const addNews = (req, res) => {
    res.render("admin/news/add", { title: "Add news" });
}

const confirmAddNews = async (req, res) => {
    const { title, description, category } = req.body;
    let images = [];

    if (req.files.file)
        req.files.file.forEach(f => images.push("/public/upload/img/" + f.filename))

    const news = {
        title: title,
        description: description,
        category: category,
        date: new Date().toDateString() + ", " + new Date().toLocaleTimeString(),
        images: images
    };

    const n = new News(news);
    await n.save();

    res.redirect("/admin/news");
}

const updateNews = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);
    res.render("admin/news/update", { title: "News update", news: news });
}

const confirmUpdateNews = async (req, res) => {
    const { id, title, description, category } = req.body;
    let news = await News.findById(id);

    news.title = title;
    news.category = category;
    news.description = description;

    await News.updateOne({ _id: id}, news);

    res.redirect("/admin/news");
}

const deleteNews = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);
    res.render("admin/news/delete", { title: "News details", news: news });
}

const confirmDeleteNews = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);

    if (news.images) {
        news.images.forEach(i => {
            if (fs.existsSync(path.join(__dirname, "..", i)))
                fs.unlinkSync(path.join(__dirname, "..", i))
        });
    }

    await News.deleteOne({ _id: id });

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

