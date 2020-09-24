const { Router } = require("express");
const indexController = require("../controllers/indexController");

const router = Router();

router.get("/", indexController.index);
router.get("/nosotros", indexController.about);
router.get("/centro-emprendedor", indexController.center);
router.get("/incubadora-de-empresas", indexController.incubator);
router.get("/contacto", indexController.contact);
router.post("/contact", indexController.contact);
router.get("/asesoria", indexController.training);
router.get("/asesoria/solicitud/descargar", indexController.downloadDocs);
router.get("/servicios", indexController.services);
router.get("/empresas", indexController.business);
router.get("/empresas/:id", indexController.businessDetails);
router.get("/news", indexController.news);
router.get("/news/:id", indexController.newsDetails);

module.exports = router;
