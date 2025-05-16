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

// Switch entre le bouton micro et le bouton envoyer 

document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.querySelector('.chat-input input[type="text"]');
    const micButton = document.querySelector('.mic-btn');
    const sendButton = document.querySelector('.send-message-btn');
    const chatMessages = document.querySelector('.chat-messages');

    chatInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            micButton.style.display = 'none';
            sendButton.style.display = 'block';
        } else {
            micButton.style.display = 'block';
            sendButton.style.display = 'none';
        }
    });

    // Gerer le clic sur le bouton d'envoi
    sendButton.addEventListener('click', function() {
        sendMessage();
    });

    // Gérer l'envoi avec la touche "Entrée"
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && this.value.trim() !== '') {
            e.preventDefault(); // Empêche le saut de ligne
        sendButton.click(); // Simule le clic sur le bouton d'envoi
        }
    });

    // Fonction pour envoyer le message
    function sendMessage() {
        const messageText = chatInput.value.trim();

        if (messageText !== '') {
            // Créer un nouvel élément de message
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'sent');
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${messageText}</p>
                </div>
                <div class="message-footer">
                    <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div class="message-status">
                        <i class="bx bx-check"></i>
                    </div>
                </div>
            `;

            // Ajouter le message à la liste des messages
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Faire défiler vers le bas

            // Réinitialiser le champ de saisie
            chatInput.value = '';
            micButton.style.display = 'block';
            sendButton.style.display = 'none';
        }
    }
});


// Interaction des emojis
document.addEventListener('DOMContentLoaded', function() {
    const emojiButton = document.querySelector('.emoji-btn');
    const emojiPicker = document.querySelector('.emoji-picker');
    const chatInput = document.querySelector('.chat-input input[type="text"]');

    // Gestionnaire du clic sur le bouton emoji 
    emojiButton.addEventListener('emoji-click', () => {
        emojiPicker.classList.toggle('visible');
    });

    // Gestionnaire du selection d'emoji
    emojiPicker.addEventListener('emoji-select', event => {
        const emoji = event.detail.unicode;
        const cursorPos = chatInput.selectionStart;
        const textBefore = chatInput.value.substring(0, cursorPos);
        const textAfter = chatInput.value.substring(cursorPos);

        chatInput.value = textBefore + emoji + textAfter;
        chatInput.focus();
        emojiPicker.classList.remove('visible');
    });

    // Fermer le picker si on clique ailleurs 
    document.addEventListener('click', (e) => {
        if (!emojiButton.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.classList.remove('visible');
        }
    });
});

// Gestion de suppressions de message 

document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour ajouter le bouton de suppression à chaque message
    function addDeleteButtons() {
        const messages = document.querySelectorAll('.message.sent');
        messages.forEach(message => {
            // Vérifier si le bouton n'existe pas déjà
            if (!message.querySelector('.delete-btn')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="bx bx-trash"></i>';
                deleteBtn.addEventListener('click', () => {
                    if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
                        message.remove();
                    }
                });
                message.appendChild(deleteBtn);
            }
        });
    }

    // Ajouter les boutons de suppression aux message existants
    addDeleteButtons();

    // Observer les nouveaux messages
    const chatMessages = document.querySelector('.chat-messages');
    const observer = new MutationObserver(() => {
        addDeleteButtons();
    });

    observer.observe(chatMessages, { 
        childList: true,
        subtree: true
    });
});

// Ajouter à la fin du fichier
document.addEventListener('DOMContentLoaded', () => {
    const infoBtn = document.querySelector('.info-btn');
    const infoDropdown = document.querySelector('.info-dropdown');

    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoDropdown.classList.toggle('active');
    });

    // Fermer le menu si on clique ailleurs sur la page
    document.addEventListener('click', (e) => {
        if (!infoDropdown.contains(e.target) && !infoBtn.contains(e.target)) {
            infoDropdown.classList.remove('active');
        }
    });
});

// Gestion de la bascule de la barre latérale
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggler = document.querySelector('.sidebar-toggler');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggler && sidebar) {
        sidebarToggler.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Gestion du menu en mode mobile
    const menuToggler = document.querySelector('.menu-toggler');
    if (menuToggler && sidebar) {
        menuToggler.addEventListener('click', function() {
            sidebar.classList.toggle('menu-active');
        });
    }
    
    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && sidebar.classList.contains('menu-active')) {
            sidebar.classList.remove('menu-active');
        }
    });
});