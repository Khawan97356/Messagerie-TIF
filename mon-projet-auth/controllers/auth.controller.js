// mon-projet-auth/controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.user;
const RefreshToken = db.refreshToken;

// Configuration secrète pour JWT
const config = {
  secret: process.env.JWT_SECRET || "votre-secret-jwt",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "votre-refresh-token-secret",
  jwtExpiration: 3600,           // 1 heure
  jwtRefreshExpiration: 86400,   // 24 heures
};

exports.signup = async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: "Email déjà utilisé!" });
    }

    // Créer un nouvel utilisateur
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    });

    return res.status(201).json({ message: "Utilisateur enregistré avec succès!" });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    // Générer un refresh token
    const refreshToken = await RefreshToken.createToken(user);

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Le refresh token est requis!" });
  }

  try {
    const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token non valide!" });
    }

    // Vérifier si le refresh token a expiré
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      return res.status(403).json({
        message: "Le refresh token a expiré. Veuillez vous reconnecter."
      });
    }

    const user = await User.findByPk(refreshToken.userId);
    
    // Créer un nouveau token d'accès
    const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token
    });
  } catch (error) {
    console.error("Erreur de rafraîchissement du token:", error);
    return res.status(500).json({ message: "Erreur lors du rafraîchissement du token", error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }
    return res.status(200).json({ message: "Déconnexion réussie!" });
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return res.status(500).json({ message: "Erreur lors de la déconnexion", error: error.message });
  }
};