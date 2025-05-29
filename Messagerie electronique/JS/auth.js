// JS/auth.js
const authService = {
    isLoggedIn() {
        return localStorage.getItem('authToken') !== null;
    },

    async register(username, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de l\'inscription');
            }

            const data = await response.json();
            console.log('Inscription réussie:', data);
            return data;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la connexion');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

         // Effacer complètement le localStorage si nécessaire
        // localStorage.clear();
    
    // Redirection directe sans utiliser window.location.href
    document.location.replace('page-connexion.html');
    
    // Arrêter l'exécution de tout autre code
    throw new Error('Déconnexion');
    },

    getToken() {
        return localStorage.getItem('authToken');
    },

    getUser() {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/HTML/page-connexion.html';
            return false;
        }
        return true;
    }
};

export default authService;