const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Définir le port
const PORT = 3000;
const JWT_SECRET = 'votre_clé_secrète_jwt';

// Middleware crucial pour parser le JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length) {
    console.log('Body:', req.body);
  }
  next();
});

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// Route pour vérifier le token
app.get('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'Messagerie electronique')));

// Route racine
app.get('/', (req, res) => {
  // Rediriger vers la page de connexion par defaut
  // La verification du token se fera coté client
  res.sendFile(path.join(__dirname, 'Messagerie electronique', 'HTML', 'page-connexion.html'));
});

// Connexion à MongoDB (à ajuster selon votre configuration)
mongoose.connect('mongodb://localhost:27017/messagerie', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Modèle d'utilisateur
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer un nouvel utilisateur
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Rechercher l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});