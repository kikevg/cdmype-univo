const cloudinary = require("cloudinary").v2;

const News = require("../models/News");

const getNews = async (req, res) => {
    const newsList = await News.find();
    let news = [];
    newsList.forEach(n => news.unshift(n));
    res.render("admin/news/list", { title: "Lista de noticias", data: news });
}

const getNewsById = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);
    res.render("admin/news/details", { title: "Detalles de noticia", news: news });
}

const addNews = (req, res) => {
    res.render("admin/news/add", { title: "Agregar noticia" });
}

const confirmAddNews = async (req, res) => {
    const { title, description, category } = req.body;
    const { file } = req.files;
    let images = [];

    if (title == "" || category == "" || description == "") {
        req.flash("error_message", "Rellene todos los campos necesarios");
        res.redirect("/admin/news/add");
        return;
    }

    if (file) {

        for (let i = 0; i < file.length; i++) {
            try {
                const result = await cloudinary.uploader.upload(file[i].path, { secure: true });
                images.push(result.url);
            } catch (err) {

                req.flash("error_message", err);
                res.redirect("/admin/news/add");

            }
        }

    }

    const news = {
        title: title,
        description: description,
        category: category,
        date: new Date().toDateString() + ", " + new Date().toLocaleTimeString(),
        images: images
    };

    const n = new News(news);
    await n.save();

    req.flash("success_message", "Datos agregados exitosamente");

    res.redirect("/admin/news/add");
}

const updateNews = async (req, res) => {
    const { id } = req.params;
    let news = await News.findById(id);
    res.render("admin/news/update", { title: "Editar noticia", news: news });
}

const confirmUpdateNews = async (req, res) => {
    const { id, title, description, category } = req.body;
    let news = await News.findById(id);

    if (title == "" || category == "" || description == "") {
        req.flash("error_message", "Rellene todos los campos necesarios");
        res.redirect("/admin/news/update/" + id);
        return;
    }

    news.title = title;
    news.category = category;
    news.description = description;

    await News.updateOne({ _id: id }, news);

    req.flash("success_message", "Datos actualizados exitosamente");

    res.redirect("/admin/news");
}

const deleteNews = async (req, res) => {
    const { id } = req.body;
    let news = await News.findById(id);

    if (news.images)
        for (let i = 0; i < news.images.length; i++) {
            try {
                await cloudinary.uploader.destroy(news.images[i].split("/").pop().split(".")[0]);
            } catch (err) {
                req.flash("error_message", err);
                res.redirect("/admin/news/delete/" + id);
            }
        }

    await News.deleteOne({ _id: id });

    req.flash("success_message", "Datos eliminados exitosamente");

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
};
