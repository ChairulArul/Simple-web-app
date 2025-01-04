const express = require("express");
const routes = express.Router();
const userControllers = require("../controllers/user_controllers");

routes.post("/register", userControllers.register);
routes.post("/login", userControllers.login);

module.exports = routes;
