import { render } from "ejs";
import express from "express";
import homeController from "../controllers/HomeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.post("/setup-profile", homeController.setupProfile);

    router.post("/setup-menu", homeController.setupmenu);
   


    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook);

    router.get('/dang_ky', homeController.handleRegister);
    router.post("/P_dang_ky", homeController.handlePostRegister);


    router.get('/khmt', (req, res) => {
        res.render('khmt.ejs');
    });


    return app.use('/', router);
}

module.exports = initWebRoutes;
