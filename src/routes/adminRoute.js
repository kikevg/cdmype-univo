const { Router } = require("express");
const adminController = require("../controllers/adminController");

const router = Router();

router.get("/", adminController.login);
router.post("/", adminController.verifyLogin);


// verifica si está logueado
router.get("/home", adminController.isLogged, adminController.home);

router.get("/logout", adminController.isLogged, adminController.logout);

module.exports = router;
