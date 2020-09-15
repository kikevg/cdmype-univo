const { Router } = require("express");

const loginController = require("../controllers/loginController");
const homeController = require("../controllers/homeController");
const businessController = require("../controllers/businessController");
const servicesController = require("../controllers/servicesController");
const employeesController = require("../controllers/employeesController");
const alliancesController = require("../controllers/alliancesController");
const newsController = require("../controllers/newsController");
const carouselController = require("../controllers/carouselController");

const router = Router();

router.get("/", loginController.loging);
router.post("/", loginController.verifyLogin);
router.get("/logout", loginController.isLogged, loginController.logout);
router.get("/home", loginController.isLogged, homeController.home);

router.get("/icons/feather", loginController.isLogged, (req, res) => {
    res.render("admin/icons/feather", { title: "Feather icons" });
});

router.get("/icons/fontawesome", loginController.isLogged, (req, res) => {
    res.render("admin/icons/fontawesome", { title: "Fontawesome icons" });
});

// para adminitracion de empresas
router.get("/business", loginController.isLogged, businessController.getBusiness);
router.get("/business/details/:id", loginController.isLogged, businessController.getBusinessById);
router.get("/business/add", loginController.isLogged, businessController.addBusiness);
router.post("/business/add", loginController.isLogged, businessController.confirmAddBusiness);
router.get("/business/update/:id", loginController.isLogged, businessController.updateBusiness);
router.post("/business/update", loginController.isLogged, businessController.confirmUpdateBusiness);
router.post("/business/delete", loginController.isLogged, businessController.deleteBusiness);

// para administracion de servicios
router.get("/services", loginController.isLogged, servicesController.getServices);
router.get("/services/details/:id", loginController.isLogged, servicesController.getServicesById);
router.get("/services/add", loginController.isLogged, servicesController.addService);
router.post("/services/add", loginController.isLogged, servicesController.confirmAddService);
router.get("/services/update/:id", loginController.isLogged, servicesController.updateService);
router.post("/services/update", loginController.isLogged, servicesController.confirmUpdateService);
router.post("/services/delete", loginController.isLogged, servicesController.deleteService);

// para administracion de empleados
router.get("/employees", loginController.isLogged, employeesController.getEmployees);
router.get("/employees/details/:id", loginController.isLogged, employeesController.getEmployeeById);
router.get("/employees/add", loginController.isLogged, employeesController.addEmployee);
router.post("/employees/add", loginController.isLogged, employeesController.confirmAddEmployee);
router.get("/employees/update/:id", loginController.isLogged, employeesController.updateEmployee);
router.post("/employees/update", loginController.isLogged, employeesController.confirmUpdateEmployee);
router.post("/employees/delete", loginController.isLogged, employeesController.deleteEmployee);

// para administracion de alianzas
router.get("/alliances", loginController.isLogged, alliancesController.getAlliances);
router.get("/alliances/details/:id", loginController.isLogged, alliancesController.getAlliancesById);
router.get("/alliances/add", loginController.isLogged, alliancesController.addAlliance);
router.post("/alliances/add", loginController.isLogged, alliancesController.confirmAddAlliance);
router.get("/alliances/update/:id", loginController.isLogged, alliancesController.updateAlliance);
router.post("/alliances/update", loginController.isLogged, alliancesController.confirmUpdateAlliance);
router.post("/alliances/delete", loginController.isLogged, alliancesController.deleteAlliance);

// para la administracion de noticias
router.get("/news", loginController.isLogged, newsController.getNews);
router.get("/news/details/:id", loginController.isLogged, newsController.getNewsById);
router.get("/news/add", loginController.isLogged, newsController.addNews);
router.post("/news/add", loginController.isLogged, newsController.confirmAddNews);
router.get("/news/update/:id", loginController.isLogged, newsController.updateNews);
router.post("/news/update", loginController.isLogged, newsController.confirmUpdateNews);
router.post("/news/delete", loginController.isLogged, newsController.deleteNews);

// para la administarcion del carousel principal
router.get("/carousel", loginController.isLogged, carouselController.getData);
router.get("/carousel/details/:id", loginController.isLogged, carouselController.getDataById);
router.get("/carousel/add", loginController.isLogged, carouselController.addImageToCarousel);
router.post("/carousel/add", loginController.isLogged, carouselController.confirmAddImageToCarousel);
router.post("/carousel/delete", loginController.isLogged, carouselController.deleteImage);

module.exports = router;
