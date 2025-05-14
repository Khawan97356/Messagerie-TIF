// Fichier: ../JS/auth.js

const AUTH_API_URL = "http://localhost:3000/api";

// Stockage du token JWT dans le localStorage
const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

// Fonction d'inscription
async function registerUser(userData) {
    try {
        const response = await fetch(`${AUTH_API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de l\'inscription');
        }
        
        // Stocker le token et rediriger vers la page principale
        if (data.token) {
            setAuthToken(data.token);
            window.location.href = "/HTML/index.html";
        }
        
        return data;
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        throw error;
    }
}

// Fonction de connexion
async function loginUser(credentials) {
    try {
        const response = await fetch(`${AUTH_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Identifiants incorrects');
        }
        
        // Stocker le token et rediriger vers la page principale
        if (data.token) {
            setAuthToken(data.token);
            window.location.href = "/HTML/index.html";
        }
        
        return data;
    } catch (error) {
        console.error("Erreur de connexion:", error);
        throw error;
    }
}

// Fonction de déconnexion
function logoutUser() {
    removeAuthToken();
    window.location.href = "/HTML/page connexion.html";
}

// Fonction pour récupérer le profil de l'utilisateur actuel
async function getCurrentUserProfile() {
    try {
        const response = await fetch(`${AUTH_API_URL}/users/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération du profil');
        }
        
        return data;
    } catch (error) {
        console.error("Erreur de récupération du profil:", error);
        throw error;
    }
}

// Fonction pour mettre à jour le profil utilisateur
async function updateUserProfile(profileData) {
    try {
        const response = await fetch(`${AUTH_API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la mise à jour du profil');
        }
        
        return data;
    } catch (error) {
        console.error("Erreur de mise à jour du profil:", error);
        throw error;
    }
}

// Fonction pour vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
    return getAuthToken() !== null;
}

// Fonction de protection des routes (redirection si non connecté)
function requireAuth() {
    if (!isUserLoggedIn()) {
        window.location.href = "/HTML/page connexion.html";
    }
}

// Exporter les fonctions
window.auth = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUserProfile,
    updateUserProfile,
    isUserLoggedIn,
    requireAuth
};