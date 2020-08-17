const { Router } = require("express");
const indexController = require("../controllers/indexController");

const router = Router();

router.get("/", indexController.index);
router.get("/about", indexController.about);
router.get("/contact", indexController.contact);
router.get("/training", indexController.training);
router.get("/training/download/solicitud", indexController.downloadDocs);
router.get("/services", indexController.services);
router.get("/business", indexController.business);
router.get("/business/:id", indexController.businessDetails);
router.get("/news", indexController.news);

module.exports = router;
