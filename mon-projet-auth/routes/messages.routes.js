// /mon-projet-auth/routes/messages.routes.js

const express = require('express');
const router = express.Router();
const { authJwt } = require("../api-test/middleware");
const messagesController = require('../controllers/messages.controller');

// Liste tous les messages de l'utilisateur connecté
router.get('/', messagesController.getAllMessages);

// Obtenir un message spécifique (vérifie si l'utilisateur est le propriétaire)
router.get('/:messageId', [authJwt.isOwner], messagesController.getMessage);

// Créer un nouveau message
router.post('/', messagesController.createMessage);

// Modifier un message (vérifie si l'utilisateur est le propriétaire)
router.put('/:messageId', [authJwt.isOwner], messagesController.updateMessage);

// Supprimer un message (vérifie si l'utilisateur est le propriétaire)
router.delete('/:messageId', [authJwt.isOwner], messagesController.deleteMessage);

module.exports = router;