const cloudinary = require("cloudinary").v2;
const moment = require("moment");

const Carousel = require("../models/Carousel.js");
const Log = require("../models/Log");

const getData = async (req, res) => {

    const imagesList = await Carousel.find();

    res.render("admin/carousel/list", { title: "Lista de images", images: imagesList });
}

const getDataById = async (req, res) => {

    const { id } = req.params;

    const carouselImage = await Carousel.findById(id);

    res.render("admin/carousel/details", { title: "Detalles", image: carouselImage });
}

const addImageToCarousel = (req, res) => {

    res.render("admin/carousel/add", { title: "Agregar imagen a carousel" });

}

const confirmAddImageToCarousel = async (req, res) => {

    const { name, description } = req.body;
    const { file } = req.files;
    let url = "";

    if (file == undefined) {
        req.flash("error_message", "Agrega una imagen para guardar");
        res.redirect("/admin/carousel");
        return;
    }

    if (file) {
        try {
            const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
            url = cloudinaryRespose.url;
        } catch (err) {

            req.flash("error_message", err.getMessage());
            res.redirect("/admin/carousel/add");

        }
    }

    const image = {
        name: name,
        description: description,
        imgPath: url
    };

    const imageCaoursel = new Carousel(image);

    await imageCaoursel.save();

    const log = new Log({
        user: {
            id: req.session.user.id,
            name: req.session.user.name
        },
        description: "Agregó una imagen a carousel",
        date: moment().format("DD/MM/YYYY - hh:mm:ss a")
    });

    await log.save();

    req.flash("success_message", "Datos agregados exitosamente");

    res.redirect("/admin/carousel/add");

}

const deleteImage = async (req, res) => {

    const { id } = req.body;

    const carouselImage = await Carousel.findById(id);

    console.log(carouselImage);

    if (carouselImage.imgPath != undefined) {
        try {
            await cloudinary.uploader.destroy(carouselImage.imgPath.split("/").pop().split(".")[0]);
        } catch (error) {
            req.flash("error_message", error);
            res.redirect("/admin/carousel");
        }
    }

    await Carousel.deleteOne({ _id: id });

    const log = new Log({
        user: {
            id: req.session.user.id,
            name: req.session.user.name
        },
        description: "Eliminó una imagen de carousel",
        date: moment().format("DD/MM/YYYY - hh:mm:ss a")
    });

    await log.save();

    req.flash("success_message", "Datos eliminados satisfactoriamente");

    res.redirect("/admin/carousel");
}

module.exports = {
    getData: getData,
    getDataById: getDataById,
    addImageToCarousel: addImageToCarousel,
    confirmAddImageToCarousel: confirmAddImageToCarousel,
    deleteImage: deleteImage,
};
