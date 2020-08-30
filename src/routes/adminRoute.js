const { Router } = require("express");

const loginController = require("../controllers/loginController");
const homeController = require("../controllers/homeController");
const businessController = require("../controllers/businessController");
const servicesController = require("../controllers/servicesController");
const employeesController = require("../controllers/employeesController");
const alliancesController = require("../controllers/alliancesController");
const newsController = require("../controllers/newsController");

const router = Router();

router.get("/", loginController.loging);
router.post("/", loginController.verifyLogin);
router.get("/logout", loginController.isLogged, loginController.logout);
router.get("/home", loginController.isLogged, homeController.home);

// para adminitracion de empresas
router.get("/business", loginController.isLogged, businessController.getBusiness);
router.get("/business/details/:id", loginController.isLogged, businessController.getBusinessById);
router.get("/business/add", loginController.isLogged, businessController.addBusiness);
router.post("/business/add", loginController.isLogged, businessController.confirmAddBusiness);
router.get("/business/update/:id", loginController.isLogged, businessController.updateBusiness);
router.post("/business/update", loginController.isLogged, businessController.confirmUpdateBusiness);
router.get("/business/delete/:id", loginController.isLogged, businessController.deleteBusiness);
router.get("/business/delete/confirm/:id", loginController.isLogged, businessController.confirmDeleteBusiness);

// para administracion de servicios
router.get("/services", loginController.isLogged, servicesController.getServices);
router.get("/services/details/:id", loginController.isLogged, servicesController.getServicesById);
router.get("/services/add", loginController.isLogged, servicesController.addService);
router.post("/services/add", loginController.isLogged, servicesController.confirmAddService);
router.get("/services/update/:id", loginController.isLogged, servicesController.updateService);
router.post("/services/update", loginController.isLogged, servicesController.confirmUpdateService);
router.get("/services/delete/:id", loginController.isLogged, servicesController.deleteService);
router.get("/services/delete/confirm/:id", loginController.isLogged, servicesController.confirmDeleteService);

// para administracion de empleados
router.get("/employees", loginController.isLogged, employeesController.getEmployees);
router.get("/employees/details/:id", loginController.isLogged, employeesController.getEmployeeById);
router.get("/employees/add", loginController.isLogged, employeesController.addEmployee);
router.post("/employees/add", loginController.isLogged, employeesController.confirmAddEmployee);
router.get("/employees/update/:id", loginController.isLogged, employeesController.updateEmployee);
router.post("/employees/update", loginController.isLogged, employeesController.confirmUpdateEmployee);
router.get("/employees/delete/:id", loginController.isLogged, employeesController.deleteEmployee);
router.get("/employees/delete/confirm/:id", loginController.isLogged, employeesController.confirmDeleteEmployee);

// para administracion de alianzas
router.get("/alliances", loginController.isLogged, alliancesController.getAlliances);
router.get("/alliances/details/:id", loginController.isLogged, alliancesController.getAlliancesById);
router.get("/alliances/add", loginController.isLogged, alliancesController.addAlliance);
router.post("/alliances/add", loginController.isLogged, alliancesController.confirmAddAlliance);
router.get("/alliances/update/:id", loginController.isLogged, alliancesController.updateAlliance);
router.post("/alliances/update", loginController.isLogged, alliancesController.confirmUpdateAlliance);
router.get("/alliances/delete/:id", loginController.isLogged, alliancesController.deleteAlliance);
router.get("/alliances/delete/confirm/:id", loginController.isLogged, alliancesController.confirmDeleteAlliance);

// para la administracion de noticias
router.get("/news", /* loginController.isLogged, */ newsController.getNews);
router.get("/news/details/:id", loginController.isLogged, newsController.getNewsById);
router.get("/news/add", loginController.isLogged, newsController.addNews);
router.post("/news/add", loginController.isLogged, newsController.confirmAddNews);
router.get("/news/update/:id", /* loginController.isLogged, */ newsController.updateNews);
router.post("/news/update", /* loginController.isLogged, */ newsController.confirmUpdateNews);
router.get("/news/delete/:id", loginController.isLogged, newsController.deleteNews);
router.get("/news/delete/confirm/:id", loginController.isLogged, newsController.confirmDeleteNews);

module.exports = router;
