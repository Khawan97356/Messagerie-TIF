require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorMiddleware = require('./api/middleware/errorMiddleware');

// Routes
const userRoutes = require('./api/routes/userRoutes');

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/users', userRoutes);

// Middleware d'erreur
app.use(errorMiddleware);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});