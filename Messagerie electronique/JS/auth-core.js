// JS/auth-core.js
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

    // Dans auth-core.js, vous pourriez ajouter :
async verifyToken() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
        const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.ok;
    } catch {
        return false;
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
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/HTML/page-connexion.html';
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