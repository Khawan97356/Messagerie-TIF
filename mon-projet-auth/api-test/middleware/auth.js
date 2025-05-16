// mon-projet-auth/middleware/auth.js
const jwt = require("jsonwebtoken");
const config = {
  secret: process.env.JWT_SECRET || "votre-secret-jwt"
};

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers.authorization;

  // Retirer le préfixe "Bearer " si présent
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).json({
      message: "Aucun token fourni!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Non autorisé!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken
};

module.exports = authJwt;