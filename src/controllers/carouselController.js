const cloudinary = require("cloudinary").v2;

const Carousel = require("../models/Carousel.js");

const getData = async (req, res) => {

    const imagesList = await Carousel.find();

    res.render("admin/carousel/list", { title: "Lista de images", images: imagesList });
}

const getDataById = async (req, res) => {

    const { id } = req.params;

    const carouselImage = await Carousel.findById(id);

    res.render("admin/carousel/details", { title: "Detalles", image: carouselImage });
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
            res.redirect("/admin/carousel");

        }
    }

    const newImageCarousel = {
        name: name,
        description: description,
        imgPath: url
    };

    const carousel = new Carousel(newImageCarousel);
    await carousel.save();

    req.flash("success_message", "Datos agregados exitosamente");

    res.redirect("/admin/carousel");

}

const updateImage = async (req, res) => {

    const { id } = req.params;

    const image = await Carousel.findById(id);

    res.render("admin/carousel/update", { title: "Editar images de carousel", image: image });

}

const confirmUpdateImage = async (req, res) => {

    const { id, name, description } = req.body;
    const { file } = req.files;
    const url = "";

    let carouselImage = await Carousel.findById(id);

    if (file) {
        try {

            await cloudinary.uploader.destroy(carouselImage.imgPath.split("/").pop().split(".")[0]);
            const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
            carouselImage.imgPath = cloudinaryRespose.url;

        } catch (err) {
            req.flash("error_message", err);
            res.redirect("/admin/carousel/update/" + id);
        }
    }

    carouselImage.name = name;
    carouselImage.description = description;

    await Carousel.updateOne({_id: id}, carouselImage);

    req.flash("success_message", "Datos actualizados correctamente");

    res.redirect("/admin/carousel");

}

const deleteImage = async (req, res) => {
    const { id } = req.params;

    const carouselImage = await Carousel.findById(id);

    res.render("admin/carousel/delete", { title: "Detalles", image: carouselImage });
}

const confirmDeleteImage = async (req, res) => {

    const { id } = req.params;

    const carouselImage = await Carousel.findById(id);

    if (carouselImage.imgPath != undefined) {
        try {
            await cloudinary.uploader.destroy(carouselImage.imgPath.split("/").pop().split(".")[0]);
        } catch (error) {
            req.flash("error_message", error);
            res.redirect("/admin/carousel/delete/" + id);
        }
    }

    await Carousel.deleteOne({ _id: id });

    req.flash("success_message", "Datos eliminados satisfactoriamente");

    res.redirect("/admin/carousel");

}

module.exports = {
    getData: getData,
    getDataById: getDataById,
    confirmAddImageToCarousel: confirmAddImageToCarousel,
    updateImage: updateImage,
    confirmUpdateImage: confirmUpdateImage,
    deleteImage: deleteImage,
    confirmDeleteImage: confirmDeleteImage,
};
