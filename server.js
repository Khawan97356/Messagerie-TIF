const express = require('express');
const app = express();

// Exemple de configuration dans server.js ou app.js

// 1. Routes publiques
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/public', require('./routes/public.routes'));

// 2. Routes protégées (authentification requise)
app.use('/api/messages', [authJwt.verifyToken], require('./routes/messages.routes'));
app.use('/api/profile', [authJwt.verifyToken], require('./routes/profile.routes'));

// 3. Routes avec protection spécifique
app.use('/api/admin', [authJwt.verifyToken, authJwt.isAdmin], require('./routes/admin.routes'));
app.use('/api/premium', [authJwt.verifyToken, authJwt.isPremium], require('./routes/premium.routes'));


// Middleware crucial pour parser le JSON
app.use(express.json());

// Middleware de logging pour voir les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Route de test simple
app.post('/test', (req, res) => {
  res.json({ message: 'Succès', reçu: req.body });
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur de test démarré sur le port ${PORT}`);
});