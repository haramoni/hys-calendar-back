const { Router } = require("express");
const authRoutes = require("./modules/auth/auth.routes");

const routes = Router();

routes.use("/auth", authRoutes);

module.exports = routes;
