// biometric-auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du système d'authentification
    const biometricOverlay = document.getElementById('biometricOverlay');
    const pinKeys = document.querySelectorAll('.pin-key');
    const pinDots = document.querySelectorAll('.pin-dot');
    const biometricStatus = document.getElementById('biometricStatus');
    const skipBiometric = document.getElementById('skipBiometric');
    
    let currentPin = '';
    const correctPin = '1234'; // Code PIN par défaut (à remplacer par votre logique)
    
    // Fonction pour mettre à jour l'affichage des points
    function updatePinDots() {
        for (let i = 0; i < pinDots.length; i++) {
            if (i < currentPin.length) {
                pinDots[i].classList.add('active');
            } else {
                pinDots[i].classList.remove('active');
            }
        }
    }
    
    // Gérer les clics sur les touches du pavé numérique
    pinKeys.forEach(key => {
        key.addEventListener('click', function() {
            // Gestion des touches spéciales
            if (this.dataset.key === 'clear') {
                currentPin = '';
                biometricStatus.textContent = '';
                biometricStatus.classList.remove('error');
            } else if (this.dataset.key === 'delete') {
                currentPin = currentPin.slice(0, -1);
            } else {
                // Ajouter le chiffre si moins de 4 chiffres
                if (currentPin.length < 4) {
                    currentPin += this.textContent;
                }
                
                // Vérifier le code si 4 chiffres
                if (currentPin.length === 4) {
                    if (currentPin === correctPin) {
                        biometricStatus.textContent = 'Authentification réussie';
                        biometricStatus.classList.remove('error');
                        biometricStatus.classList.add('success');
                        
                        // Masquer l'écran d'authentification après un délai
                        setTimeout(() => {
                            biometricOverlay.style.display = 'none';
                            // Si vous avez une fonction de callback après connexion, appelez-la ici
                        }, 1000);
                    } else {
                        biometricStatus.textContent = 'Code PIN incorrect';
                        biometricStatus.classList.add('error');
                        
                        // Réinitialiser le code après un délai
                        setTimeout(() => {
                            currentPin = '';
                            updatePinDots();
                        }, 1500);
                    }
                }
            }
            
            updatePinDots();
        });
    });
    
    // Bouton pour sauter l'authentification
    if (skipBiometric) {
        skipBiometric.addEventListener('click', function() {
            biometricOverlay.style.display = 'none';
        });
    }
    
    // Appliquer des styles pour les points actifs
    const style = document.createElement('style');
    style.textContent = `
        .pin-dot.active {
            background-color: #0abc54;
        }
        .biometric-status.error {
            color: red;
        }
        .biometric-status.success {
            color: green;
        }
    `;
    document.head.appendChild(style);
});

// Exposer l'objet auth pour être utilisé par d'autres scripts
window.auth = {
    requireAuth: function() {
        // Vérifier si l'utilisateur est déjà authentifié (par exemple via localStorage)
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (!isAuthenticated) {
            document.getElementById('biometricOverlay').style.display = 'flex';
        }
    },
    
    logout: function() {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '../HTML/page connexion.html';
    },
    
    isLoggedIn: function() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
};