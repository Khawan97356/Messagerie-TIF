// Au début de script index.js, scripts profile.js, etc.

import authService from './auth.js';

// Vérifier si l'utilisateur est connecté
function checkAuth() {
  if (!authService.isLoggedIn()) {
    // Rediriger vers la page de connexion
    window.location.href = '/HTML/page connexion.html';
    return false;
  }
  return true;
}

// Exécuter la vérification lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  
  // Charger les données de l'utilisateur
  const user = authService.getCurrentUser();
  // Personnaliser l'interface avec les informations de l'utilisateur
  if (user) {
    document.getElementById('userProfileName').textContent = user.username;
    // Autres personnalisations...
  }
  
  // Continuer avec l'initialisation normale de la page
  initPage();
});

function initPage() {
  // Code d'initialisation spécifique à la page
  // ...
}

// Fonction pour afficher les notifications
function showNotification(id) {
    const notification = document.getElementById(id);
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Gestion de la photo de profil
const photoInput = document.getElementById('photo-input');
const photoButton = document.querySelector('.edit-photo-btn');
const profilePhoto = document.getElementById('profile-photo');

photoButton.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            profilePhoto.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Validation de l'email
const emailInput = document.querySelector('input[type="email"]');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value) && emailInput.value !== '') {
            emailInput.classList.add('error');
        } else {
            emailInput.classList.remove('error');
        }
    });
}

// Gestion du bouton de sauvegarde
const saveButton = document.querySelector('.save-button');
saveButton.addEventListener('click', () => {
    // Vérifier si l'email est valide
    if (emailInput && emailInput.classList.contains('error')) {
        showNotification('error-notification');
        return;
    }

    // Simuler un chargement
    const progressContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    
    saveButton.innerHTML = '<i class="bx bx-loader bx-spin"></i> Enregistrement...';
    saveButton.disabled = true;
    saveButton.classList.add('saving');
    
    // Afficher la barre de progression
    progressContainer.style.display = 'block';
    
    // Simuler le progrès
    let width = 0;
    const progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);
            
            // Simuler un succès après le chargement
            setTimeout(() => {
                progressContainer.style.display = 'none';
                saveButton.innerHTML = '<i class="bx bx-check"></i> Enregistré !';
                saveButton.classList.remove('saving');
                showNotification('success-notification');
                
                // Réinitialiser le bouton après 2 secondes
                setTimeout(() => {
                    saveButton.innerHTML = '<i class="bx bx-save"></i> Enregistrer les modifications';
                    saveButton.disabled = false;
                }, 2000);
            }, 500);
        } else {
            width += 5;
            progressBar.style.width = width + '%';
        }
    }, 100);
    
    // Simuler une connexion réseau aléatoire (pour démonstration uniquement)
    if (Math.random() > 0.8) {
        clearInterval(progressInterval);
        progressBar.style.width = '75%';
        
        setTimeout(() => {
            progressContainer.style.display = 'none';
            saveButton.innerHTML = '<i class="bx bx-wifi-off"></i> Erreur réseau';
            saveButton.classList.remove('saving');
            saveButton.classList.add('error');
            showNotification('network-error');
            
            // Ajouter un bouton de réessai
            setTimeout(() => {
                saveButton.innerHTML = '<i class="bx bx-refresh"></i> Réessayer';
                saveButton.disabled = false;
                saveButton.classList.remove('error');
                saveButton.classList.add('retry');
            }, 2000);
        }, 1500);
    }
});

// Initialisation des éléments du formulaire avec des valeurs par défaut
document.addEventListener('DOMContentLoaded', () => {
    // Exemple de données de profil pour démonstration
    const userData = {
        username: "Jean Dupont",
        bio: "Passionné de technologie et de design. J'aime voyager et découvrir de nouvelles cultures.",
        email: "jean.dupont@example.com",
        phone: "+33 6 12 34 56 78"
    };
    
    // Remplir les champs avec les données exemple
    const inputs = document.querySelectorAll('.profile-input');
    inputs[0].value = userData.username;
    inputs[1].value = userData.bio;
    inputs[2].value = userData.email;
    inputs[3].value = userData.phone;
    
    // Activer certains switchs par défaut
    const switches = document.querySelectorAll('input[type="checkbox"]');
    switches[0].checked = true; // Statut en ligne
    switches[1].checked = true; // Sons des messages
});

// Fonctionnalité de recadrage d'image
let cropper = null;
const cropModal = document.getElementById('crop-modal');
const imageElement = document.getElementById('image-to-crop');

// Ouvre la modal de recadrage quand l'utilisateur clique sur le bouton d'édition photo
photoButton.addEventListener('click', (e) => {
    e.preventDefault();
    photoInput.click();
});

// Quand l'utilisateur sélectionne une nouvelle image
photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Validation du type de fichier
        if (!file.type.match('image.*')) {
            showNotification('error-notification');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            // Afficher l'image dans la modal de recadrage
            imageElement.src = event.target.result;
            cropModal.style.display = 'block';
            
            // Initialiser Cropper.js après un court délai pour s'assurer que l'image est chargée
            setTimeout(() => {
                if (cropper) {
                    cropper.destroy();
                }
                
                cropper = new Cropper(imageElement, {
                    aspectRatio: 1, // Ratio carré pour la photo de profil
                    viewMode: 1,     // Restreindre la zone de recadrage à l'image
                    dragMode: 'move', // Permet de déplacer l'image
                    guides: true,     // Affiche les guides de recadrage
                    center: true,     // Affiche l'indicateur central
                    highlight: false, // Désactive le highlight autour de l'image
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                    minContainerWidth: 250,
                    minContainerHeight: 250,
                });
            }, 200);
        };
        reader.readAsDataURL(file);
    }
});

// Contrôles du recadrage
document.getElementById('rotate-left').addEventListener('click', () => {
    if (cropper) cropper.rotate(-90);
});

document.getElementById('rotate-right').addEventListener('click', () => {
    if (cropper) cropper.rotate(90);
});

document.getElementById('zoom-in').addEventListener('click', () => {
    if (cropper) cropper.zoom(0.1);
});

document.getElementById('zoom-out').addEventListener('click', () => {
    if (cropper) cropper.zoom(-0.1);
});

// Annuler le recadrage
document.getElementById('cancel-crop').addEventListener('click', () => {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    cropModal.style.display = 'none';
    photoInput.value = ''; // Réinitialiser l'input pour permettre de sélectionner le même fichier
});

// Fermer la modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('cancel-crop').click();
});

// Appliquer le recadrage
document.getElementById('apply-crop').addEventListener('click', () => {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas({
            width: 300,   // Largeur de la photo recadrée
            height: 300,  // Hauteur de la photo recadrée
            fillColor: '#fff', // Couleur de remplissage pour les zones transparentes
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });
        
        if (canvas) {
            // Convertir le canvas en URL de données
            const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            // Mettre à jour la photo de profil
            profilePhoto.src = croppedImageUrl;
            
            // Simuler l'envoi au serveur
            simulateImageUpload(croppedImageUrl);
            
            // Fermer la modal et nettoyer
            cropper.destroy();
            cropper = null;
            cropModal.style.display = 'none';
            
            // Montrer une notification de succès
            showNotification('success-notification');
        }
    }
});

// Simuler l'envoi de l'image au serveur
function simulateImageUpload(imageData) {
    // Ici nous simulerions l'envoi de l'image au serveur
    console.log('Image recadrée prête à être envoyée au serveur');
    
    // Convertir en Blob pour un envoi simulé
    const byteString = atob(imageData.split(',')[1]);
    const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], {type: mimeString});
    const formData = new FormData();
    formData.append('profile_image', blob, 'profile.jpg');
    
    // Simuler une requête fetch
    console.log('Formulaire préparé avec l\'image, taille:', blob.size, 'bytes');
}

// Fermer la modal si l'utilisateur clique en dehors
window.addEventListener('click', (e) => {
    if (e.target === cropModal) {
        document.getElementById('cancel-crop').click();
    }
});

// Fonctionnalité de sauvegarde automatique
const autosaveStatus = document.getElementById('autosave-status');
const autosaveIndicator = document.querySelector('.autosave-indicator');
const autosaveText = document.querySelector('.autosave-text');
let autosaveTimeout;
let lastSavedState = {};
const AUTOSAVE_DELAY = 3000; // 3 secondes

// Fonction pour montrer le statut de la sauvegarde automatique
function showAutosaveStatus(status, message) {
    autosaveStatus.classList.add('visible');
    
    // Réinitialiser les classes
    autosaveIndicator.classList.remove('saving', 'saved', 'error');
    
    if (status) {
        autosaveIndicator.classList.add(status);
    }
    
    if (message) {
        autosaveText.textContent = message;
    }
    
    // Masquer après 3 secondes si le statut est "saved" ou "error"
    if (status === 'saved' || status === 'error') {
        setTimeout(() => {
            autosaveStatus.classList.remove('visible');
        }, 3000);
    }
}

// Récupérer l'état actuel du formulaire
function getCurrentFormState() {
    const state = {};
    document.querySelectorAll('.profile-input').forEach(input => {
        state[input.id || input.name || input.getAttribute('data-field')] = input.value;
    });
    return state;
}

// Détecter si le formulaire a changé
function hasFormChanged() {
    const currentState = getCurrentFormState();
    return JSON.stringify(currentState) !== JSON.stringify(lastSavedState);
}

// Sauvegarder automatiquement les modifications
function setupAutosave() {
    // Initialiser l'état initial
    lastSavedState = getCurrentFormState();
    
    // Surveiller les modifications dans tous les champs
    document.querySelectorAll('.profile-input').forEach(input => {
        input.addEventListener('input', () => {
            // Annuler le minuteur précédent
            clearTimeout(autosaveTimeout);
            
            // Montrer l'indicateur de "en cours de sauvegarde"
            showAutosaveStatus('saving', 'Sauvegarde en cours...');
            
            // Définir un nouveau minuteur
            autosaveTimeout = setTimeout(() => {
                if (hasFormChanged()) {
                    // Simuler la sauvegarde (remplacer par une vraie requête API)
                    simulateAutosave()
                        .then(() => {
                            // Mettre à jour l'état sauvegardé
                            lastSavedState = getCurrentFormState();
                            showAutosaveStatus('saved', 'Modifications enregistrées');
                            // Ajouter à l'historique des versions
                            addToVersionHistory('Modification automatique', lastSavedState);
                        })
                        .catch(() => {
                            showAutosaveStatus('error', 'Échec de la sauvegarde');
                        });
                } else {
                    // Aucun changement à sauvegarder
                    autosaveStatus.classList.remove('visible');
                }
            }, AUTOSAVE_DELAY);
        });
    });
}

// Simuler une requête de sauvegarde automatique
function simulateAutosave() {
    return new Promise((resolve, reject) => {
        const success = Math.random() > 0.1; // 10% de chance d'échec pour la démonstration
        
        // Simuler le délai réseau
        setTimeout(() => {
            if (success) {
                console.log('Auto-sauvegarde réussie', getCurrentFormState());
                resolve();
            } else {
                console.log('Auto-sauvegarde échouée');
                reject();
            }
        }, 1000);
    });
}

// Initialiser l'autosave lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter IDs aux champs pour faciliter la sauvegarde automatique
    const inputFields = document.querySelectorAll('.profile-input');
    inputFields.forEach((input, index) => {
        if (!input.id) {
            input.id = `field-${index}`;
        }
    });
    
    setupAutosave();
});

// Fonctionnalité d'historique des versions
const versionHistory = [];
const historyModal = document.getElementById('history-modal');
const versionList = document.getElementById('version-list');
const showHistoryBtn = document.getElementById('show-history-btn');

// Ajouter une version à l'historique
function addToVersionHistory(description, state) {
    const now = new Date();
    const version = {
        id: Date.now(),
        timestamp: now,
        description: description,
        state: JSON.parse(JSON.stringify(state)) // Copie profonde
    };
    
    // Limiter l'historique à 20 versions (par exemple)
    if (versionHistory.length >= 20) {
        versionHistory.shift(); // Enlève la plus ancienne version
    }
    
    versionHistory.push(version);
    
    // Sauvegarder l'historique dans le localStorage
    localStorage.setItem('profile-version-history', JSON.stringify(versionHistory));
    
    return version;
}

// Charger l'historique des versions
function loadVersionHistory() {
    const savedHistory = localStorage.getItem('profile-version-history');
    if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        versionHistory.length = 0; // Vider l'historique actuel
        parsedHistory.forEach(version => versionHistory.push(version));
    }
}

// Afficher l'historique des versions
function displayVersionHistory() {
    versionList.innerHTML = '';
    
    if (versionHistory.length === 0) {
        versionList.innerHTML = '<div class="no-versions">Aucune modification enregistrée</div>';
        return;
    }
    
    // Trier par date (plus récent d'abord)
    const sortedVersions = [...versionHistory].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedVersions.forEach(version => {
        const versionDate = new Date(version.timestamp);
        const formattedDate = versionDate.toLocaleDateString() + ' ' + versionDate.toLocaleTimeString();
        
        const versionItem = document.createElement('div');
        versionItem.className = 'version-item';
        versionItem.innerHTML = `
            <div class="version-header">
                <div class="version-title">${version.description}</div>
                <div class="version-date">${formattedDate}</div>
            </div>
            <div class="version-changes">
                ${generateChangeSummary(version)}
            </div>
            <div class="version-actions">
                <button class="version-button restore-button" data-version-id="${version.id}">
                    <i class='bx bx-undo'></i> Restaurer
                </button>
                <button class="version-button view-button" data-version-id="${version.id}">
                    <i class='bx bx-show'></i> Voir détails
                </button>
            </div>
        `;
        
        versionList.appendChild(versionItem);
    });
    
    // Ajouter les écouteurs d'événements pour les boutons
    document.querySelectorAll('.restore-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const versionId = parseInt(e.currentTarget.getAttribute('data-version-id'));
            restoreVersion(versionId);
        });
    });
    
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const versionId = parseInt(e.currentTarget.getAttribute('data-version-id'));
            viewVersionDetails(versionId);
        });
    });
}

// Générer un résumé des changements
function generateChangeSummary(version) {
    // Compter les champs modifiés
    const fieldCount = Object.keys(version.state).length;
    return `${fieldCount} champ(s) modifié(s)`;
}

// Restaurer une version précédente
function restoreVersion(versionId) {
    const version = versionHistory.find(v => v.id === versionId);
    if (!version) return;
    
    // Demander confirmation avant de restaurer
    if (confirm('Êtes-vous sûr de vouloir restaurer cette version ? Les modifications non sauvegardées seront perdues.')) {
        // Restaurer les valeurs des champs
        Object.entries(version.state).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field) field.value = value;
        });
        
        // Mise à jour de l'état sauvegardé
        lastSavedState = JSON.parse(JSON.stringify(version.state));
        
        // Ajouter cette restauration à l'historique
        addToVersionHistory('Restauration d\'une version précédente', lastSavedState);
        
        // Afficher une notification
        showNotification('success-notification');
        
        // Fermer la modale
        historyModal.style.display = 'none';
    }
}

// Voir les détails d'une version
function viewVersionDetails(versionId) {
    const version = versionHistory.find(v => v.id === versionId);
    if (!version) return;
    
    // Créer une alerte avec les détails ou une modale plus sophistiquée
    let details = 'Détails de la version:\n\n';
    Object.entries(version.state).forEach(([field, value]) => {
        details += `${field}: ${value}\n`;
    });
    
    alert(details);
    // Note: dans une vraie application, vous afficheriez ceci dans une UI plus élégante
}

// Gestionnaire d'événements pour le bouton d'historique
showHistoryBtn.addEventListener('click', () => {
    displayVersionHistory();
    historyModal.style.display = 'block';
});

// Fermer la modale d'historique
document.querySelectorAll('.close-history, .close-modal').forEach(element => {
    element.addEventListener('click', () => {
        historyModal.style.display = 'none';
    });
});

// Charger l'historique des versions lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadVersionHistory();
});

// Fonctionnalité d'authentification pour modifications sensibles
const authModal = document.getElementById('auth-modal');
const authPasswordInput = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const confirmAuthBtn = document.getElementById('confirm-auth');
const cancelAuthBtn = document.getElementById('cancel-auth');

// Configuration - définir quels champs sont sensibles
const sensitiveFields = ['email', 'field-2'];  // IDs des champs sensibles (email, téléphone, etc.)
let pendingChange = null;
let authCallback = null;

// Marquer les champs sensibles
function markSensitiveFields() {
    sensitiveFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Ajouter la classe et l'icône de cadenas
            field.parentElement.classList.add('sensitive-field');
            const icon = document.createElement('i');
            icon.className = 'bx bx-lock-alt sensitive-field-icon';
            icon.title = "Information sensible - vérification nécessaire pour modifier";
            field.parentElement.appendChild(icon);
            
            // Ajouter un comportement spécial à ce champ
            setupSensitiveField(field);
        }
    });
}

// Configuration des champs sensibles
function setupSensitiveField(field) {
    let originalValue = field.value;
    
    // Stocker la valeur originale quand le champ reçoit le focus
    field.addEventListener('focus', () => {
        originalValue = field.value;
    });
    
    // Vérifier si la valeur a changé quand le champ perd le focus
    field.addEventListener('blur', () => {
        if (field.value !== originalValue) {
            // Stocker le changement en attente
            pendingChange = {
                field: field,
                newValue: field.value,
                originalValue: originalValue
            };
            
            // Restaurer temporairement l'ancienne valeur jusqu'à authentification
            field.value = originalValue;
            
            // Demander authentification
            requestAuthentication(() => {
                // Si authentification réussie, appliquer le changement
                field.value = pendingChange.newValue;
                originalValue = pendingChange.newValue;
                
                // Ajouter à l'historique des versions
                const currentState = getCurrentFormState();
                addToVersionHistory('Modification d\'information sensible', currentState);
                
                // Notification de succès
                showNotification('success-notification');
            });
        }
    });
}

// Demander l'authentification
function requestAuthentication(callback) {
    authCallback = callback;
    authPasswordInput.value = '';
    authError.textContent = '';
    authModal.style.display = 'block';
    
    // Mettre le focus sur le champ de mot de passe
    setTimeout(() => {
        authPasswordInput.focus();
    }, 100);
}

// Vérifier le mot de passe
function verifyPassword(password) {
    // Dans une vraie application, ceci serait une requête au serveur
    // Pour cette démo, nous utilisons un mot de passe codé en dur
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mot de passe de démo: "password123"
            if (password === 'password123') {
                resolve(true);
            } else {
                reject('Mot de passe incorrect');
            }
        }, 1000);
    });
}

// Événements pour la modale d'authentification
confirmAuthBtn.addEventListener('click', () => {
    const password = authPasswordInput.value;
    if (!password) {
        authError.textContent = 'Veuillez entrer votre mot de passe';
        authPasswordInput.classList.add('shake');
        setTimeout(() => {
            authPasswordInput.classList.remove('shake');
        }, 500);
        return;
    }
    
    // Désactiver le bouton pendant la vérification
    confirmAuthBtn.disabled = true;
    confirmAuthBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Vérification...';
    
    // Vérifier le mot de passe
    verifyPassword(password)
        .then(() => {
            // Authentification réussie
            authModal.style.display = 'none';
            if (authCallback) {
                authCallback();
                authCallback = null;
            }
        })
        .catch(error => {
            // Échec de l'authentification
            authError.textContent = error;
            authPasswordInput.classList.add('shake');
            setTimeout(() => {
                authPasswordInput.classList.remove('shake');
            }, 500);
        })
        .finally(() => {
            // Réactiver le bouton
            confirmAuthBtn.disabled = false;
            confirmAuthBtn.innerHTML = 'Confirmer';
        });
});

cancelAuthBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
    authCallback = null;
    pendingChange = null;
});

// Initialiser les champs sensibles au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    markSensitiveFields();
});

// Empêcher la soumission du formulaire par la touche Entrée dans le champ de mot de passe
authPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        confirmAuthBtn.click();
    }
});

// Fonctionnalité de liens vers les réseaux sociaux
function setupSocialLinks() {
    const socialInputs = document.querySelectorAll('.social-input');
    
    socialInputs.forEach(input => {
        const platform = input.closest('.social-link-item').getAttribute('data-platform');
        const previewElement = document.getElementById(`${platform}-preview`);
        const statusElement = document.getElementById(`${platform}-status`);
        const previewLink = previewElement.querySelector('.preview-link');
        const baseUrl = input.getAttribute('data-preview-url');
        
        // Charger les valeurs sauvegardées
        const savedValue = localStorage.getItem(`social-${platform}`);
        if (savedValue) {
            input.value = savedValue;
            updateSocialPreview(input, previewElement, previewLink, baseUrl);
            statusElement.textContent = 'Connecté';
            statusElement.classList.add('connected');
        }
        
        // Mettre à jour la prévisualisation lorsque l'utilisateur tape
        input.addEventListener('input', () => {
            updateSocialPreview(input, previewElement, previewLink, baseUrl);
            
            // Mettre à jour le statut
            if (input.value.trim()) {
                statusElement.textContent = 'Connecté';
                statusElement.classList.add('connected');
                
                // Sauvegarder localement
                localStorage.setItem(`social-${platform}`, input.value.trim());
            } else {
                statusElement.textContent = 'Non connecté';
                statusElement.classList.remove('connected');
                localStorage.removeItem(`social-${platform}`);
            }
        });
    });
}

// Mettre à jour la prévisualisation du lien social
function updateSocialPreview(input, previewElement, previewLink, baseUrl) {
    const username = input.value.trim();
    
    if (username) {
        let url;
        // Gérer le cas où l'utilisateur entre une URL complète pour LinkedIn
        if (input.id === 'linkedin-input' && (username.startsWith('http') || username.includes('linkedin.com'))) {
            url = username.startsWith('http') ? username : `https://${username}`;
        } else {
            url = `${baseUrl}${username}`;
        }
        
        previewLink.href = url;
        previewLink.querySelector('.preview-text').textContent = url;
        previewElement.classList.add('active');
    } else {
        previewElement.classList.remove('active');
    }
}

// Initialiser les liens sociaux au chargement
document.addEventListener('DOMContentLoaded', () => {
    setupSocialLinks();
});

// Fonctionnalité de partage de profil
function setupProfileSharing() {
    const shareProfileBtn = document.getElementById('share-profile-btn');
    const shareModal = document.getElementById('share-modal');
    const profileUrlInput = document.getElementById('profile-url');
    const shareProfileUrlInput = document.getElementById('share-profile-url');
    const copyUrlBtn = document.getElementById('copy-url-btn');
    const shareCopyUrlBtn = document.getElementById('share-copy-url-btn');
    const profileVisibilitySelect = document.getElementById('profile-visibility');
    const allowSharingCheckbox = document.getElementById('allow-sharing');
    const infoVisibilitySelects = document.querySelectorAll('.info-visibility');
    
    // Générer une URL de profil aléatoire pour la démo
    const generateProfileUrl = () => {
        const username = document.querySelector('input[value="Nom actuel"]').value;
        const sanitizedUsername = username.toLowerCase().replace(/\s+/g, '-');
        return `https://exemple.com/profil/${sanitizedUsername}`;
    };
    
    // Initialiser l'URL du profil
    const profileUrl = generateProfileUrl();
    profileUrlInput.value = profileUrl;
    shareProfileUrlInput.value = profileUrl;
    
    // Mettre à jour l'aperçu de partage
    const updateSharePreview = () => {
        const nameInput = document.querySelector('input[value="Nom actuel"]');
        const bioInput = document.querySelector('textarea.profile-input');
        
        document.getElementById('share-profile-name').textContent = nameInput.value;
        document.getElementById('share-profile-bio').textContent = bioInput.value || 'Aucune bio disponible';
        document.getElementById('share-profile-image').src = profilePhoto.src;
    };
    
    // Fonctionnalité de copie d'URL
    const copyToClipboard = (input, button) => {
        input.select();
        document.execCommand('copy');
        
        // Feedback visuel
        button.classList.add('copied');
        button.innerHTML = '<i class="bx bx-check"></i>';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = '<i class="bx bx-copy"></i>';
        }, 2000);
    };
    
    // Écouteurs d'événements pour les boutons de copie
    copyUrlBtn.addEventListener('click', () => copyToClipboard(profileUrlInput, copyUrlBtn));
    shareCopyUrlBtn.addEventListener('click', () => copyToClipboard(shareProfileUrlInput, shareCopyUrlBtn));
    
    // Ouvrir la modale de partage
    shareProfileBtn.addEventListener('click', () => {
        // Vérifier si le partage est autorisé
        if (!allowSharingCheckbox.checked) {
            showNotification('error-notification');
            alert('Le partage de profil est désactivé. Veuillez l\'activer dans les paramètres de confidentialité.');
            return;
        }
        
        updateSharePreview();
        shareModal.style.display = 'block';
    });
    
    // Fermer la modale de partage
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            shareModal.style.display = 'none';
        });
    });
    
    // Gérer les options de partage
    document.querySelectorAll('.share-option-btn').forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.getAttribute('data-platform');
            const shareUrl = encodeURIComponent(profileUrl);
            const shareTitle = encodeURIComponent(`Découvrez mon profil: ${document.getElementById('share-profile-name').textContent}`);
            
            let shareLink = '';
            
            switch (platform) {
                case 'facebook':
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                    break;
                case 'twitter':
                    shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
                    break;
                case 'whatsapp':
                    shareLink = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
                    break;
                case 'email':
                    shareLink = `mailto:?subject=${shareTitle}&body=Découvrez%20mon%20profil:%20${shareUrl}`;
                    break;
            }
            
            if (shareLink) {
                window.open(shareLink, '_blank');
            }
        });
    });
    
    // Sauvegarder les paramètres de confidentialité
    const savePrivacySettings = () => {
        const settings = {
            profileVisibility: profileVisibilitySelect.value,
            allowSharing: allowSharingCheckbox.checked,
            infoVisibility: {}
        };
        
        infoVisibilitySelects.forEach(select => {
            const infoType = select.getAttribute('data-info');
            settings.infoVisibility[infoType] = select.value;
        });
        
        localStorage.setItem('privacy-settings', JSON.stringify(settings));
    };
    
    // Charger les paramètres de confidentialité
    const loadPrivacySettings = () => {
        const savedSettings = localStorage.getItem('privacy-settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            profileVisibilitySelect.value = settings.profileVisibility;
            allowSharingCheckbox.checked = settings.allowSharing;
            
            if (settings.infoVisibility) {
                infoVisibilitySelects.forEach(select => {
                    const infoType = select.getAttribute('data-info');
                    if (settings.infoVisibility[infoType]) {
                        select.value = settings.infoVisibility[infoType];
                    }
                });
            }
        }
    };
    
    // Écouter les changements des paramètres de confidentialité
    profileVisibilitySelect.addEventListener('change', savePrivacySettings);
    allowSharingCheckbox.addEventListener('change', savePrivacySettings);
    infoVisibilitySelects.forEach(select => {
        select.addEventListener('change', savePrivacySettings);
    });
    
    // Initialiser les paramètres de confidentialité
    loadPrivacySettings();
}

// Initialiser le partage de profil au chargement
document.addEventListener('DOMContentLoaded', () => {
    setupProfileSharing();
});

// Fonctionnalité de badges et certifications
function setupBadgesAndCertifications() {
    const badgesShowcase = document.getElementById('badges-showcase');
    const certificationsListContainer = document.getElementById('certifications-list');
    const addBadgeBtn = document.getElementById('add-badge-btn');
    const reorderBadgeBtn = document.getElementById('reorder-badges-btn');
    const addCertificationBtn = document.getElementById('add-certification-btn');
    const badgeModal = document.getElementById('badge-modal');
    const certificationModal = document.getElementById('certification-modal');
    
    let badges = [];
    let certifications = [];
    let editingBadgeIndex = -1;
    let editingCertificationIndex = -1;
    
    // Charger les badges et certifications
    function loadBadgesAndCertifications() {
        const savedBadges = localStorage.getItem('profile-badges');
        if (savedBadges) {
            badges = JSON.parse(savedBadges);
        }
        
        const savedCertifications = localStorage.getItem('profile-certifications');
        if (savedCertifications) {
            certifications = JSON.parse(savedCertifications);
        }
        
        renderBadges();
        renderCertifications();
    }
    
    // Enregistrer les badges
    function saveBadges() {
        localStorage.setItem('profile-badges', JSON.stringify(badges));
    }
    
    // Enregistrer les certifications
    function saveCertifications() {
        localStorage.setItem('profile-certifications', JSON.stringify(certifications));
    }
    
    // Afficher les badges
    function renderBadges() {
        badgesShowcase.innerHTML = '';
        
        if (badges.length === 0) {
            badgesShowcase.classList.add('empty');
            badgesShowcase.textContent = 'Aucun badge ajouté. Cliquez sur "Ajouter un badge" pour commencer.';
            return;
        }
        
        badgesShowcase.classList.remove('empty');
        
        badges.forEach((badge, index) => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'profile-badge';
            badgeElement.innerHTML = `
                <div class="badge-icon" style="background-color: ${badge.color};">
                    <i class='bx ${badge.icon}'></i>
                </div>
                <div class="badge-info">
                    <div class="badge-name">${badge.name}</div>
                    ${badge.description ? `<div class="badge-description">${badge.description}</div>` : ''}
                </div>
                <div class="badge-actions">
                    <button class="badge-action-btn edit" data-index="${index}">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="badge-action-btn delete" data-index="${index}">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `;
            
            badgesShowcase.appendChild(badgeElement);
        });
        
        // Ajouter des écouteurs d'événements pour les boutons d'édition et de suppression
        document.querySelectorAll('.badge-action-btn.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(button.getAttribute('data-index'));
                editBadge(index);
            });
        });
        
        document.querySelectorAll('.badge-action-btn.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(button.getAttribute('data-index'));
                if (confirm('Êtes-vous sûr de vouloir supprimer ce badge ?')) {
                    badges.splice(index, 1);
                    saveBadges();
                    renderBadges();
                }
            });
        });
        
        // Ajouter des descriptions Tooltip
        document.querySelectorAll('.profile-badge').forEach(badge => {
            badge.addEventListener('click', () => {
                const description = badge.querySelector('.badge-description');
                if (description) {
                    alert(description.textContent);
                }
            });
        });
    }
    
    // Afficher les certifications
    function renderCertifications() {
        certificationsListContainer.innerHTML = '';
        
        if (certifications.length === 0) {
            certificationsListContainer.innerHTML = '<div class="no-certifications">Aucune certification ajoutée.</div>';
            return;
        }
        
        certifications.forEach((certification, index) => {
            const certificationElement = document.createElement('div');
            certificationElement.className = 'certification-item';
            
            const issueDate = new Date(certification.date);
            const formattedDate = issueDate.toLocaleDateString();
            
            certificationElement.innerHTML = `
                <div class="certification-logo">
                    <i class='bx bx-medal'></i>
                </div>
                <div class="certification-details">
                    <div class="certification-name">${certification.name}</div>
                    <div class="certification-issuer">${certification.issuer}</div>
                    <div class="certification-date">Obtenue le ${formattedDate}</div>
                </div>
                ${certification.url ? `
                <a href="${certification.url}" target="_blank" class="certification-verify">
                    <i class='bx bx-check-shield'></i>
                    Vérifier
                </a>
                ` : ''}
                <div class="certification-actions">
                    <button class="certification-action-btn edit" data-index="${index}">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="certification-action-btn delete" data-index="${index}">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `;
            
            certificationsListContainer.appendChild(certificationElement);
        });
        
        // Ajouter des écouteurs d'événements pour les boutons d'édition et de suppression
        document.querySelectorAll('.certification-action-btn.edit').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                editCertification(index);
            });
        });
        
        document.querySelectorAll('.certification-action-btn.delete').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                if (confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) {
                    certifications.splice(index, 1);
                    saveCertifications();
                    renderCertifications();
                }
            });
        });
    }
    
    // Configurer la modale de badge
    function setupBadgeModal() {
        const badgeNameInput = document.getElementById('badge-name');
        const badgeIconInput = document.getElementById('badge-icon-input');
        const badgeColorInput = document.getElementById('badge-color-input');
        const badgeDescriptionInput = document.getElementById('badge-description');
        const badgePreview = document.getElementById('badge-preview');
        const iconOptions = document.querySelectorAll('.icon-option');
        const colorOptions = document.querySelectorAll('.color-option');
        const modalTitle = document.getElementById('badge-modal-title');
        const saveButton = document.getElementById('save-badge');
        
        // Mettre à jour l'aperçu du badge
        function updateBadgePreview() {
            const name = badgeNameInput.value || 'Nom du badge';
            const icon = badgeIconInput.value || 'bx-code-block';
            const color = badgeColorInput.value || '#6366f1';
            
            badgePreview.innerHTML = `
                <div class="badge-icon" style="background-color: ${color};">
                    <i class='bx ${icon}'></i>
                </div>
                <div class="badge-info">
                    <div class="badge-name">${name}</div>
                </div>
            `;
        }
        
        // Gérer la sélection d'icône
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                iconOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                badgeIconInput.value = option.getAttribute('data-icon');
                updateBadgePreview();
            });
        });
        
        // Gérer la sélection de couleur
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                badgeColorInput.value = option.getAttribute('data-color');
                updateBadgePreview();
            });
        });
        
        // Mettre à jour l'aperçu lorsque le nom change
        badgeNameInput.addEventListener('input', updateBadgePreview);
        
        // Réinitialiser le formulaire
        function resetBadgeForm() {
            badgeNameInput.value = '';
            badgeDescriptionInput.value = '';
            iconOptions.forEach(opt => opt.classList.remove('selected'));
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            iconOptions[0].classList.add('selected');
            colorOptions[0].classList.add('selected');
            badgeIconInput.value = iconOptions[0].getAttribute('data-icon');
            badgeColorInput.value = colorOptions[0].getAttribute('data-color');
            updateBadgePreview();
            editingBadgeIndex = -1;
            modalTitle.textContent = 'Ajouter un badge';
            saveButton.textContent = 'Ajouter';
        }
        
        // Ouvrir la modale pour ajouter un badge
        addBadgeBtn.addEventListener('click', () => {
            resetBadgeForm();
            badgeModal.style.display = 'block';
        });
        
        // Fermer la modale
        document.querySelector('#badge-modal .close-modal').addEventListener('click', () => {
            badgeModal.style.display = 'none';
        });
        document.getElementById('cancel-badge').addEventListener('click', () => {
            badgeModal.style.display = 'none';
        });
        
        // Sauvegarder le badge
        saveButton.addEventListener('click', () => {
            const name = badgeNameInput.value.trim();
            if (!name) {
                alert('Veuillez saisir un nom pour le badge.');
                return;
            }
            
            const badge = {
                name: name,
                icon: badgeIconInput.value,
                color: badgeColorInput.value,
                description: badgeDescriptionInput.value.trim()
            };
            
            if (editingBadgeIndex === -1) {
                // Ajouter un nouveau badge
                badges.push(badge);
            } else {
                // Mettre à jour un badge existant
                badges[editingBadgeIndex] = badge;
            }
            
            saveBadges();
            renderBadges();
            badgeModal.style.display = 'none';
        });
        
        // Initialiser l'aperçu
        iconOptions[0].classList.add('selected');
        colorOptions[0].classList.add('selected');
        badgeIconInput.value = iconOptions[0].getAttribute('data-icon');
        badgeColorInput.value = colorOptions[0].getAttribute('data-color');
        updateBadgePreview();
        
        return { resetBadgeForm };
    }
    
    // Fonction pour éditer un badge
    function editBadge(index) {
        const badge = badges[index];
        editingBadgeIndex = index;
        
        const badgeNameInput = document.getElementById('badge-name');
        const badgeDescriptionInput = document.getElementById('badge-description');
        const iconOptions = document.querySelectorAll('.icon-option');
        const colorOptions = document.querySelectorAll('.color-option');
        
        badgeNameInput.value = badge.name;
        badgeDescriptionInput.value = badge.description || '';
        
        // Sélectionner l'icône correspondante
        iconOptions.forEach(opt => {
            if (opt.getAttribute('data-icon') === badge.icon) {
                opt.click();
            }
        });
        
        // Sélectionner la couleur correspondante
        colorOptions.forEach(opt => {
            if (opt.getAttribute('data-color') === badge.color) {
                opt.click();
            }
        });
        
        // Mettre à jour le titre et le bouton de la modale
        document.getElementById('badge-modal-title').textContent = 'Modifier le badge';
        document.getElementById('save-badge').textContent = 'Enregistrer';
        
        badgeModal.style.display = 'block';
    }
    
    // Configurer la modale de certification
    function setupCertificationModal() {
        const certificationNameInput = document.getElementById('certification-name');
        const certificationIssuerInput = document.getElementById('certification-issuer');
        const certificationDateInput = document.getElementById('certification-date');
        const certificationUrlInput = document.getElementById('certification-url');
        const certificationPreview = document.getElementById('certification-preview');
        const modalTitle = document.getElementById('certification-modal-title');
        const saveButton = document.getElementById('save-certification');
        
        // Mettre à jour l'aperçu de la certification
        function updateCertificationPreview() {
            const name = certificationNameInput.value || 'Nom de la certification';
            const issuer = certificationIssuerInput.value || 'Organisme émetteur';
            const date = certificationDateInput.value 
                ? new Date(certificationDateInput.value).toLocaleDateString() 
                : 'Date d\'obtention';
            
            certificationPreview.innerHTML = `
                <div class="certification-logo">
                    <i class='bx bx-medal'></i>
                </div>
                <div class="certification-details">
                    <div class="certification-name">${name}</div>
                    <div class="certification-issuer">${issuer}</div>
                    <div class="certification-date">${date}</div>
                </div>
            `;
        }
        
        // Mettre à jour l'aperçu lorsque les entrées changent
        certificationNameInput.addEventListener('input', updateCertificationPreview);
        certificationIssuerInput.addEventListener('input', updateCertificationPreview);
        certificationDateInput.addEventListener('change', updateCertificationPreview);
        
        // Réinitialiser le formulaire
        function resetCertificationForm() {
            certificationNameInput.value = '';
            certificationIssuerInput.value = '';
            certificationDateInput.value = '';
            certificationUrlInput.value = '';
            updateCertificationPreview();
            editingCertificationIndex = -1;
            modalTitle.textContent = 'Ajouter une certification';
            saveButton.textContent = 'Ajouter';
        }
        
        // Ouvrir la modale pour ajouter une certification
        addCertificationBtn.addEventListener('click', () => {
            resetCertificationForm();
            certificationModal.style.display = 'block';
        });
        
        // Fermer la modale
        document.querySelector('#certification-modal .close-modal').addEventListener('click', () => {
            certificationModal.style.display = 'none';
        });
        document.getElementById('cancel-certification').addEventListener('click', () => {
            certificationModal.style.display = 'none';
        });
        
        // Sauvegarder la certification
        saveButton.addEventListener('click', () => {
            const name = certificationNameInput.value.trim();
            const issuer = certificationIssuerInput.value.trim();
            const date = certificationDateInput.value;
            
            if (!name || !issuer || !date) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            const certification = {
                name: name,
                issuer: issuer,
                date: date,
                url: certificationUrlInput.value.trim()
            };
            
            if (editingCertificationIndex === -1) {
                // Ajouter une nouvelle certification
                certifications.push(certification);
            } else {
                // Mettre à jour une certification existante
                certifications[editingCertificationIndex] = certification;
            }
            
            saveCertifications();
            renderCertifications();
            certificationModal.style.display = 'none';
        });
        
        // Initialiser l'aperçu
        updateCertificationPreview();
        
        return { resetCertificationForm };
    }
    
    // Fonction pour éditer une certification
    function editCertification(index) {
        const certification = certifications[index];
        editingCertificationIndex = index;
        
        const certificationNameInput = document.getElementById('certification-name');
        const certificationIssuerInput = document.getElementById('certification-issuer');
        const certificationDateInput = document.getElementById('certification-date');
        const certificationUrlInput = document.getElementById('certification-url');
        
        certificationNameInput.value = certification.name;
        certificationIssuerInput.value = certification.issuer;
        certificationDateInput.value = certification.date;
        certificationUrlInput.value = certification.url || '';
        
        // Mettre à jour le titre et le bouton de la modale
        document.getElementById('certification-modal-title').textContent = 'Modifier la certification';
        document.getElementById('save-certification').textContent = 'Enregistrer';
        
        // Mettre à jour l'aperçu
        document.getElementById('certification-name').dispatchEvent(new Event('input'));
        
        certificationModal.style.display = 'block';
    }
    
    // Configurer le bouton de réorganisation
    function setupReordering() {
        reorderBadgeBtn.addEventListener('click', () => {
            // Implémenter la fonctionnalité de glisser-déposer pour réorganiser
            alert('Fonctionnalité à venir : vous pourrez bientôt réorganiser vos badges par glisser-déposer.');
        });
    }
    
    // Initialiser les modales et charger les données
    const { resetBadgeForm } = setupBadgeModal();
    const { resetCertificationForm } = setupCertificationModal();
    setupReordering();
    loadBadgesAndCertifications();
}

// Initialiser les badges et certifications au chargement
document.addEventListener('DOMContentLoaded', () => {
    setupBadgesAndCertifications();
});

// Fonctionnalité d'importation de données
function setupDataImport() {
    const importButtons = document.querySelectorAll('.import-button');
    const fileUploadInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadFileBtn = document.getElementById('upload-file-btn');
    const importModal = document.getElementById('import-modal');
    const importPlatformName = document.getElementById('import-platform-name');
    const platformNameElements = document.querySelectorAll('.platform-name');
    
    // Variables pour suivre l'état de l'importation
    let currentPlatform = '';
    let currentStep = 'authentication';
    let selectedOptions = [];
    let importData = null;
    let uploadedFile = null;
    
    // Afficher une étape d'importation et masquer les autres
    function showImportStep(step) {
        document.querySelectorAll('.import-step').forEach(el => {
            el.style.display = 'none';
        });
        
        document.getElementById(`import-${step}`).style.display = 'block';
        currentStep = step;
        
        // Mise à jour des boutons du pied de page de la modale
        const continueButton = document.getElementById('continue-import');
        const cancelButton = document.getElementById('cancel-import');
        const modalFooter = document.getElementById('import-modal-footer');
        
        switch (step) {
            case 'authentication':
                modalFooter.style.display = 'flex';
                continueButton.disabled = true;
                continueButton.textContent = 'Continuer';
                break;
            case 'selection':
                modalFooter.style.display = 'flex';
                continueButton.disabled = false;
                continueButton.textContent = 'Continuer';
                break;
            case 'preview':
                modalFooter.style.display = 'flex';
                continueButton.disabled = false;
                continueButton.textContent = 'Importer';
                break;
            case 'progress':
                modalFooter.style.display = 'none';
                break;
            case 'success':
                modalFooter.style.display = 'flex';
                continueButton.disabled = false;
                continueButton.textContent = 'Terminer';
                cancelButton.style.display = 'none';
                break;
            case 'error':
                modalFooter.style.display = 'flex';
                continueButton.disabled = false;
                continueButton.textContent = 'Fermer';
                break;
            default:
                modalFooter.style.display = 'flex';
                continueButton.disabled = true;
        }
    }
    
    // Initialiser la modale d'importation
    function initImportModal(platform) {
        currentPlatform = platform;
        importPlatformName.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
        
        // Mettre à jour tous les éléments affichant le nom de la plateforme
        platformNameElements.forEach(el => {
            el.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
        });
        
        // Réinitialiser et montrer la première étape
        showImportStep('authentication');
        importModal.style.display = 'block';
    }
    
    // Gestionnaire pour les boutons d'importation de plateforme
    importButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.closest('.platform-card').getAttribute('data-platform');
            initImportModal(platform);
        });
    });
    
    // Simuler l'authentification OAuth
    document.getElementById('oauth-button').addEventListener('click', () => {
        // Simuler un processus d'authentification
        document.getElementById('oauth-button').disabled = true;
        document.getElementById('oauth-button').innerHTML = '<i class="bx bx-loader bx-spin"></i> Connexion en cours...';
        
        // Simuler un délai de connexion
        setTimeout(() => {
            // Activer le bouton continuer
            document.getElementById('continue-import').disabled = false;
            document.getElementById('oauth-button').innerHTML = '<i class="bx bx-check"></i> Connecté avec succès';
            document.getElementById('oauth-button').style.backgroundColor = 'var(--success)';
        }, 2000);
    });
    
    // Gérer le téléchargement de fichier
    fileUploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            uploadedFile = e.target.files[0];
            fileNameDisplay.textContent = uploadedFile.name;
            uploadFileBtn.disabled = false;
        } else {
            fileNameDisplay.textContent = '';
            uploadFileBtn.disabled = true;
            uploadedFile = null;
        }
    });
    
    // Gérer le bouton d'upload de fichier
    uploadFileBtn.addEventListener('click', () => {
        if (!uploadedFile) return;
        
        // Simuler une analyse du fichier
        uploadFileBtn.disabled = true;
        uploadFileBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Analyse en cours...';
        
        setTimeout(() => {
            // Déterminer le type de fichier
            if (uploadedFile.name.endsWith('.json')) {
                processJsonFile();
            } else if (uploadedFile.name.endsWith('.csv')) {
                processCsvFile();
            } else {
                showNotification('error-notification');
                uploadFileBtn.innerHTML = '<i class="bx bx-x"></i> Format non supporté';
                uploadFileBtn.disabled = true;
                
                setTimeout(() => {
                    uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Importer le fichier';
                    uploadFileBtn.disabled = false;
                }, 2000);
            }
        }, 1500);
    });
    
    // Simuler le traitement d'un fichier JSON
    function processJsonFile() {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);
                
                // Simuler des données d'importation pour la démonstration
                importData = {
                    profile: {
                        name: jsonData.name || 'Nom non trouvé',
                        bio: jsonData.bio || jsonData.description || 'Bio non trouvée',
                        email: jsonData.email || 'Email non trouvé'
                    },
                    certifications: jsonData.certifications || []
                };
                
                // Initialiser la modale avec les données
                currentPlatform = 'fichier';
                initImportPreview();
                
                uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Fichier analysé';
                setTimeout(() => {
                    uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Importer le fichier';
                    uploadFileBtn.disabled = false;
                }, 2000);
                
            } catch (e) {
                console.error("Erreur lors du traitement du fichier JSON:", e);
                uploadFileBtn.innerHTML = '<i class="bx bx-x"></i> Fichier invalide';
                showNotification('error-notification');
                
                setTimeout(() => {
                    uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Importer le fichier';
                    uploadFileBtn.disabled = false;
                }, 2000);
            }
        };
        
        reader.onerror = () => {
            uploadFileBtn.innerHTML = '<i class="bx bx-x"></i> Erreur de lecture';
            showNotification('error-notification');
            
            setTimeout(() => {
                uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Importer le fichier';
                uploadFileBtn.disabled = false;
            }, 2000);
        };
        
        reader.readAsText(uploadedFile);
    }
    
    // Simuler le traitement d'un fichier CSV
    function processCsvFile() {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csvData = event.target.result;
                
                // Parse simple de CSV (dans une application réelle, utilisez une bibliothèque)
                const lines = csvData.split('\n');
                const headers = lines[0].split(',');
                
                // Simuler des données d'importation
                importData = {
                    profile: {
                        name: 'Importé depuis CSV',
                        bio: 'Données importées depuis un fichier CSV',
                        email: 'exemple@domaine.com'
                    },
                    certifications: []
                };
                
                // Ajouter quelques certifications de démonstration
                for (let i = 1; i < Math.min(lines.length, 5); i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',');
                        importData.certifications.push({
                            name: values[0] || `Certification ${i}`,
                            issuer: values[1] || 'Organisme inconnu',
                            date: values[2] || new Date().toISOString().split('T')[0]
                        });
                    }
                }
                
                // Initialiser la modale avec les données
                currentPlatform = 'fichier';
                initImportPreview();
                
                uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Fichier analysé';
                setTimeout(() => {
                    uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Importer le fichier';
                    uploadFileBtn.disabled = false;
                }, 2000);
                
            } catch (e) {
                console.error("Erreur lors du traitement du fichier CSV:", e);
                uploadFileBtn.innerHTML = '<i class="bx bx-x"></i> Fichier invalide';
                showNotification('error-notification');
                
                setTimeout(() => {
                    uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Importer le fichier';
                    uploadFileBtn.disabled = false;
                }, 2000);
            }
        };
        
        reader.onerror = () => {
            uploadFileBtn.innerHTML = '<i class="bx bx-x"></i> Erreur de lecture';
            showNotification('error-notification');
            
            setTimeout(() => {
                uploadFileBtn.innerHTML = '<i class="bx bx-check"></i> Importer le fichier';
                uploadFileBtn.disabled = false;
            }, 2000);
        };
        
        reader.readAsText(uploadedFile);
    }
    
    // Simuler l'obtention et l'affichage des données de prévisualisation
    function initImportPreview() {
        // Simuler des données d'aperçu en fonction de la plateforme
        if (!importData) {
            if (currentPlatform === 'linkedin') {
                importData = {
                    profile: {
                        name: 'Jean Dupont',
                        bio: 'Développeur web avec 5 ans d\'expérience',
                        email: 'jean.dupont@exemple.com'
                    },
                    certifications: [
                        { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: '2023-03-15' },
                        { name: 'Professional Scrum Master', issuer: 'Scrum.org', date: '2022-11-10' }
                    ]
                };
            } else if (currentPlatform === 'github') {
                importData = {
                    profile: {
                        name: 'Jean Dupont',
                        bio: 'Full-stack developer | Open source contributor',
                        email: 'jean.dupont@github.com'
                    },
                    certifications: []
                };
            } else if (currentPlatform === 'google') {
                importData = {
                    profile: {
                        name: 'Jean Dupont',
                        bio: '',
                        email: 'jean.dupont@gmail.com'
                    },
                    certifications: []
                };
            }
        }
        
        // Afficher les données de prévisualisation
        const profilePreview = document.querySelector('.import-section[data-section="profile"] .import-preview-content');
        const certPreview = document.querySelector('.import-section[data-section="certifications"] .import-preview-content');
        
        // Prévisualisation du profil
        if (importData.profile) {
            profilePreview.innerHTML = `
                <p><strong>Nom:</strong> ${importData.profile.name}</p>
                <p><strong>Bio:</strong> ${importData.profile.bio || 'Non disponible'}</p>
                <p><strong>Email:</strong> ${importData.profile.email || 'Non disponible'}</p>
            `;
        } else {
            profilePreview.innerHTML = '<p>Aucune information de profil disponible</p>';
        }
        
        // Prévisualisation des certifications
        if (importData.certifications && importData.certifications.length > 0) {
            let certsHtml = '';
            importData.certifications.forEach(cert => {
                certsHtml += `
                    <div class="preview-cert-item">
                        <p><strong>${cert.name}</strong></p>
                        <p>Émis par: ${cert.issuer}</p>
                        <p>Date: ${new Date(cert.date).toLocaleDateString()}</p>
                    </div>
                `;
            });
            certPreview.innerHTML = certsHtml;
        } else {
            certPreview.innerHTML = '<p>Aucune certification disponible</p>';
        }
        
        // Afficher la modale d'importation
        importModal.style.display = 'block';
        showImportStep('preview');
    }
    
    // Simuler l'importation des données
    function importDataFromPlatform() {
        showImportStep('progress');
        
        const progressBar = document.getElementById('import-progress-bar');
        const progressText = document.getElementById('import-progress-text');
        const statusText = document.getElementById('import-status');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            // Mettre à jour le statut
            if (progress === 20) {
                statusText.textContent = 'Récupération des données du profil...';
            } else if (progress === 40) {
                statusText.textContent = 'Traitement des informations personnelles...';
            } else if (progress === 60) {
                statusText.textContent = 'Importation des certifications...';
            } else if (progress === 80) {
                statusText.textContent = 'Finalisation de l\'importation...';
            }
            
            // Fin de l'importation
            if (progress >= 100) {
                clearInterval(interval);
                statusText.textContent = 'Importation terminée !';
                
                // Simuler une pause avant d'afficher le succès
                setTimeout(() => {
                    showImportSuccess();
                }, 500);
            }
        }, 100);
        
        // Simuler une erreur aléatoire (pour la démo)
        if (Math.random() < 0.1) { // 10% de chance d'erreur
            clearInterval(interval);
            setTimeout(() => {
                showImportError('Erreur de connexion au serveur. Veuillez réessayer.');
            }, 1500);
        }
    }
    
    // Afficher le succès de l'importation
    function showImportSuccess() {
        const summaryElement = document.getElementById('import-summary');
        
        // Créer un résumé de l'importation
        let summary = '<ul>';
        if (importData.profile) {
            summary += '<li>Informations du profil importées avec succès</li>';
        }
        if (importData.certifications && importData.certifications.length > 0) {
            summary += `<li>${importData.certifications.length} certification(s) importée(s)</li>`;
        }
        summary += '</ul>';
        
        summaryElement.innerHTML = summary;
        
        // Appliquer les données importées
        applyImportedData();
        
        showImportStep('success');
    }
    
    // Afficher une erreur d'importation
    function showImportError(message) {
        document.getElementById('import-error-message').textContent = message;
        showImportStep('error');
    }
    
    // Appliquer les données importées au profil
    function applyImportedData() {
        // Dans une vraie application, vous mettriez à jour les champs du profil
        // et ajouteriez les certifications
        
        // Simuler la mise à jour de quelques champs pour la démo
        if (importData.profile) {
            if (importData.profile.name) {
                document.querySelector('input[value="Nom actuel"]').value = importData.profile.name;
            }
            
            if (importData.profile.bio) {
                const bioTextarea = document.querySelector('textarea.profile-input');
                if (bioTextarea) {
                    bioTextarea.value = importData.profile.bio;
                }
            }
            
            if (importData.profile.email) {
                const emailInput = document.querySelector('input[type="email"]');
                if (emailInput) {
                    emailInput.value = importData.profile.email;
                }
            }
        }
        
        // Ajouter les certifications importées
        if (importData.certifications && importData.certifications.length > 0) {
            // Récupérer les certifications existantes du localStorage
            let existingCertifications = [];
            const savedCertifications = localStorage.getItem('profile-certifications');
            if (savedCertifications) {
                existingCertifications = JSON.parse(savedCertifications);
            }
            
            // Ajouter les nouvelles certifications
            const updatedCertifications = [...existingCertifications];
            importData.certifications.forEach(cert => {
                updatedCertifications.push({
                    name: cert.name,
                    issuer: cert.issuer,
                    date: cert.date,
                    url: cert.url || ''
                });
            });
            
            // Sauvegarder les certifications mises à jour
            localStorage.setItem('profile-certifications', JSON.stringify(updatedCertifications));
            
            // Mettre à jour l'affichage si la fonction est disponible
            if (typeof renderCertifications === 'function') {
                renderCertifications();
            }
        }
    }
    
    // Gestionnaire pour le bouton Continuer
    document.getElementById('continue-import').addEventListener('click', () => {
        switch (currentStep) {
            case 'authentication':
                // Passer à l'étape de sélection
                showImportStep('selection');
                break;
            case 'selection':
                // Passer à l'étape de prévisualisation
                initImportPreview();
                break;
            case 'preview':
                // Démarrer l'importation
                importDataFromPlatform();
                break;
            case 'success':
                // Fermer la modale
                importModal.style.display = 'none';
                // Afficher une notification de succès
                showNotification('success-notification');
                break;
            case 'error':
                // Fermer la modale
                importModal.style.display = 'none';
                break;
        }
    });
    
    // Gestionnaire pour le bouton Annuler
    document.getElementById('cancel-import').addEventListener('click', () => {
        importModal.style.display = 'none';
    });
    
    // Gestionnaire pour le bouton Réessayer
    document.getElementById('retry-import').addEventListener('click', () => {
        showImportStep('authentication');
    });
    
    // Fermer la modale
    document.querySelector('#import-modal .close-modal').addEventListener('click', () => {
        importModal.style.display = 'none';
    });
}

// Initialiser l'importation de données au chargement
document.addEventListener('DOMContentLoaded', () => {
    setupDataImport();
});

// Fonctionnalité d'illustrations et icônes personnalisées
function setupCustomSections() {
    const customizeSectionsBtn = document.getElementById('customize-sections-btn');
    const sectionsModal = document.getElementById('sections-modal');
    const saveSectionsBtn = document.getElementById('save-sections');
    const resetSectionsBtn = document.getElementById('reset-sections');
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    // Paramètres de section par défaut
    const defaultSections = {
        'profile-info': { icon: 'bx-user', style: 'default' },
        'privacy-settings': { icon: 'bx-lock', style: 'default' },
        'notification-preferences': { icon: 'bx-bell', style: 'default' },
        'social-links': { icon: 'bx-link', style: 'default' },
        'badges-container': { icon: 'bx-medal', style: 'default' }
    };
    
    // Paramètres de section actuels
    let currentSections = JSON.parse(JSON.stringify(defaultSections));
    
    // Charger les paramètres de section sauvegardés
    function loadSectionSettings() {
        const savedSections = localStorage.getItem('section-settings');
        if (savedSections) {
            currentSections = JSON.parse(savedSections);
        }
        applySectionSettings();
    }
    
    // Enregistrer les paramètres de section
    function saveSectionSettings() {
        localStorage.setItem('section-settings', JSON.stringify(currentSections));
    }
    
    // Appliquer les paramètres de section
    function applySectionSettings() {
        Object.entries(currentSections).forEach(([sectionId, settings]) => {
            const sectionElement = document.querySelector(`.${sectionId}`);
            if (sectionElement) {
                // Appliquer le style
                sectionElement.className = `settings-container ${sectionId} style-${settings.style}`;
                
                // Ajouter ou mettre à jour l'icône
                let titleElement = sectionElement.querySelector('.section-title');
                if (titleElement) {
                    let iconElement = titleElement.querySelector('.section-icon');
                    
                    if (!iconElement) {
                        iconElement = document.createElement('div');
                        iconElement.className = 'section-icon';
                        titleElement.prepend(iconElement);
                    }
                    
                    iconElement.innerHTML = `<i class='bx ${settings.icon}'></i>`;
                }
            }
        });
    }
    
    // Mettre à jour les sélections dans la modale
    function updateSectionSelections() {
        document.querySelectorAll('.section-customizer').forEach(customizer => {
            const sectionId = customizer.getAttribute('data-section');
            const settings = currentSections[sectionId];
            
            if (settings) {
                // Sélectionner l'icône actuelle
                const iconOptions = customizer.querySelectorAll('.icon-option');
                iconOptions.forEach(option => {
                    option.classList.toggle('selected', option.getAttribute('data-icon') === settings.icon);
                });
                
                // Sélectionner le style actuel
                const styleOptions = customizer.querySelectorAll('.style-option');
                styleOptions.forEach(option => {
                    option.classList.toggle('selected', option.getAttribute('data-style') === settings.style);
                });
            }
        });
    }
    
    // Ouvrir la modale de personnalisation des sections
    customizeSectionsBtn.addEventListener('click', () => {
        updateSectionSelections();
        sectionsModal.style.display = 'block';
    });
    
    // Fermer la modale
    document.querySelector('#sections-modal .close-modal').addEventListener('click', () => {
        sectionsModal.style.display = 'none';
    });
    
    // Gérer les toggles de section
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const options = toggle.closest('.section-customizer').querySelector('.section-options');
            const isActive = options.classList.contains('active');
            
            // Fermer tous les autres panels
            document.querySelectorAll('.section-options').forEach(panel => {
                panel.classList.remove('active');
            });
            document.querySelectorAll('.section-toggle').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Ouvrir/fermer le panel actuel
            if (!isActive) {
                options.classList.add('active');
                toggle.classList.add('active');
            }
        });
    });
    
    // Gérer la sélection d'icône
    document.querySelectorAll('.section-icon-selector .icon-option').forEach(option => {
        option.addEventListener('click', () => {
            const sectionId = option.closest('.section-customizer').getAttribute('data-section');
            const icon = option.getAttribute('data-icon');
            
            // Mettre à jour la sélection
            option.closest('.icon-selector').querySelectorAll('.icon-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Mettre à jour les paramètres
            if (currentSections[sectionId]) {
                currentSections[sectionId].icon = icon;
            }
        });
    });
    
    // Gérer la sélection de style
    document.querySelectorAll('.style-selector .style-option').forEach(option => {
        option.addEventListener('click', () => {
            const sectionId = option.closest('.section-customizer').getAttribute('data-section');
            const style = option.getAttribute('data-style');
            
            // Mettre à jour la sélection
            option.closest('.style-selector').querySelectorAll('.style-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Mettre à jour les paramètres
            if (currentSections[sectionId]) {
                currentSections[sectionId].style = style;
            }
        });
    });
    
    // Réinitialiser les sections
    resetSectionsBtn.addEventListener('click', () => {
        currentSections = JSON.parse(JSON.stringify(defaultSections));
        updateSectionSelections();
    });
    
    // Sauvegarder les sections
    saveSectionsBtn.addEventListener('click', () => {
        saveSectionSettings();
        applySectionSettings();
        sectionsModal.style.display = 'none';
        showNotification('success-notification');
    });
    
    // Ajouter des illustrations pour les états vides
    function addEmptyStateIllustrations() {
        // Badges vides
        const badgesShowcase = document.getElementById('badges-showcase');
        if (badgesShowcase && badgesShowcase.classList.contains('empty')) {
            const emptyBadges = `
            <div class="empty-state">
                <svg class="empty-state-illustration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="50" fill="var(--primary-light)" opacity="0.2"/>
                    <circle cx="100" cy="100" r="40" fill="var(--primary-color)" opacity="0.4"/>
                    <text x="100" y="105" text-anchor="middle" fill="var(--primary-dark)" font-size="24">
                        <tspan x="100" y="105" font-family="sans-serif">🏆</tspan>
                    </text>
                </svg>
                <p class="empty-state-message">Aucun badge ajouté. Cliquez sur "Ajouter un badge" pour commencer.</p>
            </div>
            `;
            badgesShowcase.innerHTML = emptyBadges;
        }
        
        // Certifications vides
        const certificationsList = document.getElementById('certifications-list');
        if (certificationsList && certificationsList.querySelector('.no-certifications')) {
            const emptyCertifications = `
            <div class="empty-state">
                <svg class="empty-state-illustration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="50" width="100" height="100" rx="10" fill="var(--primary-light)" opacity="0.2"/>
                    <rect x="60" y="60" width="80" height="80" rx="5" fill="var(--primary-color)" opacity="0.4"/>
                    <text x="100" y="105" text-anchor="middle" fill="var(--primary-dark)" font-size="24">
                        <tspan x="100" y="105" font-family="sans-serif">📜</tspan>
                    </text>
                </svg>
                <p class="empty-state-message">Aucune certification ajoutée. Ajoutez vos qualifications pour les mettre en valeur.</p>
            </div>
            `;
            certificationsList.innerHTML = emptyCertifications;
        }
    }
    
    // Initialiser les sections personnalisées
    loadSectionSettings();
    
    // Exécuter après un délai pour s'assurer que d'autres fonctions ont été initialisées
    setTimeout(addEmptyStateIllustrations, 500);
}

// Initialiser toutes les fonctionnalités de personnalisation
document.addEventListener('DOMContentLoaded', () => {
    setupCustomAvatar();
    setupCustomTheme();
    setupDynamicBackground();
    setupCustomSections();
});