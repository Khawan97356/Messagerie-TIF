/**
 * Module pour l'authentification par code PIN
 * Gère l'interface utilisateur et simule l'authentification
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initialisation du module d'authentification biométrique");
    
    // Éléments DOM
    const biometricOverlay = document.getElementById('biometricOverlay');
    const pinContainer = document.getElementById('pinContainer');
    const skipBiometric = document.getElementById('skipBiometric');
    const biometricStatus = document.getElementById('biometricStatus');
    const pinDots = document.querySelectorAll('.pin-dot');
    const pinKeys = document.querySelectorAll('.pin-key');
    
    // Vérifier que tous les éléments sont trouvés
    if (!biometricOverlay) console.error("Élément 'biometricOverlay' non trouvé");
    if (!pinContainer) console.error("Élément 'pinContainer' non trouvé");
    if (!skipBiometric) console.error("Élément 'skipBiometric' non trouvé");
    if (!biometricStatus) console.error("Élément 'biometricStatus' non trouvé");
    
    // Afficher l'application principale au démarrage mais avec l'overlay par-dessus
    const sidebar = document.querySelector('aside.sidebar');
    const chatContainer = document.querySelector('main.chat-container');
    const chatBox = document.querySelector('div.chat-box');
    
    if (sidebar) sidebar.style.display = 'flex';
    if (chatContainer) chatContainer.style.display = 'block';
    if (chatBox) chatBox.style.display = 'block';
    
    // Variables de l'application
    let pinInput = '';
    const correctPin = '1234'; // PIN à définir
    
    /**
     * Met à jour l'affichage des points pour le PIN
     */
    function updatePinDots() {
        console.log("Mise à jour des points PIN, longueur actuelle:", pinInput.length);
        
        // Réinitialiser tous les points d'abord
        pinDots.forEach(dot => {
            dot.classList.remove('filled');
        });
        
        // Illuminer uniquement les points correspondant aux chiffres entrés
        for (let i = 0; i < pinInput.length; i++) {
            if (i < pinDots.length) {
                pinDots[i].classList.add('filled');
            }
        }
    }
    
    /**
     * Vérifie si le PIN entré est correct
     */
    function verifyPin() {
        console.log("Vérification du PIN:", pinInput);
        
        if (pinInput === correctPin) {
            console.log("PIN correct!");
            
            // Message de bienvenue en vert
            if (biometricStatus) {
                biometricStatus.textContent = 'Code correct ! Bienvenue !';
                biometricStatus.style.color = '#28a745';
                biometricStatus.style.fontWeight = 'bold';
                biometricStatus.style.fontSize = '1rem';
                biometricStatus.style.textAlign = 'center';
                biometricStatus.style.margin = '10px 0';
            }
            
            // Effet visuel pour les points (tous verts)
            pinDots.forEach(dot => {
                dot.style.backgroundColor = '#28a745';
                dot.style.transform = 'scale(1.1)';
                dot.style.transition = 'all 0.3s ease';
            });
            
            // Léger délai avant de masquer l'overlay
            setTimeout(() => {
                // Transition en fondu pour masquer l'overlay
                biometricOverlay.style.opacity = '0';
                
                setTimeout(() => {
                    biometricOverlay.style.display = 'none';
                    console.log("Authentification réussie - Accès à l'application");
                }, 300);
            }, 1500);
        } else {
            console.log("PIN incorrect!");
            
            if (biometricStatus) {
                biometricStatus.textContent = 'Code PIN incorrect. Veuillez réessayer.';
                biometricStatus.style.color = '#dc3545';
                biometricStatus.style.textAlign = 'center';
                biometricStatus.style.margin = '10px 0';
            }
            
            // Effet visuel pour les points (rouge pour erreur)
            pinDots.forEach(dot => {
                if (dot.classList.contains('filled')) {
                    dot.style.backgroundColor = '#dc3545';
                    dot.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        dot.style.backgroundColor = '';
                        dot.style.transform = '';
                    }, 500);
                }
            });
            
            // Effacer le PIN après quelques secondes
            setTimeout(() => {
                pinInput = '';
                updatePinDots();
                if (biometricStatus) biometricStatus.textContent = '';
            }, 1500);
        }
    }
    
    // Gestionnaires d'événements pour le clavier PIN
    pinKeys.forEach(key => {
        key.addEventListener('click', () => {
            const keyValue = key.getAttribute('data-key') || key.textContent;
            console.log("Touche pressée:", keyValue);
            
            if (keyValue === 'clear' || key.classList.contains('pin-clear')) {
                // Effacer tout le PIN
                pinInput = '';
                if (biometricStatus) biometricStatus.textContent = '';
                updatePinDots();
            } else if (keyValue === 'delete' || key.classList.contains('pin-delete')) {
                // Supprimer le dernier chiffre
                pinInput = pinInput.slice(0, -1);
                updatePinDots();
            } else if (pinInput.length < 4) {
                // Ajouter un chiffre (limité à 4)
                pinInput += keyValue;
                updatePinDots();
                
                // Ajouter un effet visuel au bouton pressé
                key.style.backgroundColor = 'rgba(77, 124, 255, 0.2)';
                setTimeout(() => {
                    key.style.backgroundColor = '';
                }, 200);
                
                // Vérifier si le PIN est complet
                if (pinInput.length === 4) {
                    verifyPin();
                }
            }
        });
    });
    
    // Permettre le saut de l'authentification (pour démo/test)
    if (skipBiometric) {
        skipBiometric.addEventListener('click', () => {
            console.log("Authentification ignorée");
            biometricOverlay.style.opacity = '0';
            
            setTimeout(() => {
                biometricOverlay.style.display = 'none';
            }, 300);
        });
    }
    
    // Ajouter une transition pour une disparition en douceur
    if (biometricOverlay) {
        biometricOverlay.style.transition = 'opacity 0.3s ease';
    }
    
    // Initialiser l'état des points (tous vides au départ)
    updatePinDots();
    console.log("Module d'authentification biométrique initialisé");
});