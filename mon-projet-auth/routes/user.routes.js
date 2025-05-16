// /mon-projet-auth/routes/user.routes.js

const { authJwt } = require("../api-test/middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Route publique (pas de middleware d'authentification)
  app.get("/api/public-content", controller.publicContent);

  // Routes protégées avec le middleware d'authentification
  app.get(
    "/api/user/profile",
    [authJwt.verifyToken], // Protection par authentification
    controller.userProfile
  );

  app.get(
    "/api/messages",
    [authJwt.verifyToken], // Protection par authentification
    controller.getAllMessages
  );

  // Route pour les administrateurs
  app.get(
    "/api/admin/dashboard",
    [authJwt.verifyToken, authJwt.isAdmin], // Protection par authentification + vérification du rôle
    controller.adminDashboard
  );
};