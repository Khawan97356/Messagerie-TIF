document.addEventListener('DOMContentLoaded', function() {
    // Vérification d'authentification
    function checkAuth() {
        // Pour le développement, on peut désactiver temporairement cette vérification
        return true;
    }

    if (!checkAuth()) return;
    
    // Éléments du DOM (avec sélecteurs corrigés)
    const chatInput = document.querySelector('.chat-input input[type="text"]');
    const micBtn = document.querySelector('.mic-btn');
    const sendBtn = document.querySelector('.send-message-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const emojiBtn = document.querySelector('.emoji-btn');
    const attachBtn = document.querySelector('.attachement-btn');
    const fileInput = document.getElementById('file-input');
    const infoBtn = document.querySelector('.info-btn');
    const infoDropdown = document.querySelector('.info-dropdown');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggler = document.querySelector('.sidebar-toggler');
    const menuToggler = document.querySelector('.menu-toggler');
    
    // CORRECTION 1: Initialisation visible des boutons d'envoi et micro
    if (micBtn) micBtn.style.display = 'flex';
    if (sendBtn) sendBtn.style.display = 'none';
    
    // CORRECTION 2: Gestion du changement entre micro et bouton d'envoi
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                if (micBtn) micBtn.style.display = 'none';
                if (sendBtn) sendBtn.style.display = 'flex';
            } else {
                if (micBtn) micBtn.style.display = 'flex';
                if (sendBtn) sendBtn.style.display = 'none';
            }
        });
    }
    
    // CORRECTION 3: Fonction d'envoi de message améliorée
    function sendMessage() {
        if (!chatInput) return;
        
        const messageText = chatInput.value.trim();
        if (messageText === '') return;
        
        // Création du message avec une structure correcte
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        
        // HTML interne corrigé pour correspondre à la structure du document
        messageElement.innerHTML = `
            <p>${messageText}</p>
            <div class="message-footer">
                <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                <span class="message-status">
                    <i class="bx bx-check-double"></i>
                </span>
            </div>
        `;
        
        // Ajout du bouton de suppression
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="bx bx-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
                messageElement.remove();
            }
        });
        messageElement.appendChild(deleteBtn);
        
        // Ajout du message à la conversation
        if (chatMessages) {
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Réinitialisation du champ de saisie
        chatInput.value = '';
        if (micBtn) micBtn.style.display = 'flex';
        if (sendBtn) sendBtn.style.display = 'none';
    }
    
    // CORRECTION 4: Gestionnaires d'événements d'envoi
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Gestion des autres interactions UI
    if (sidebarToggler && sidebar) {
        sidebarToggler.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    if (menuToggler && sidebar) {
        menuToggler.addEventListener('click', function() {
            sidebar.classList.toggle('menu-active');
        });
    }
    
    if (infoBtn && infoDropdown) {
        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            infoDropdown.classList.toggle('show');
        });
    }
    
    // Fermeture des éléments ouverts en cliquant ailleurs
    document.addEventListener('click', function(e) {
        // Fermer le menu mobile
        if (sidebar && !sidebar.contains(e.target) && sidebar.classList.contains('menu-active')) {
            sidebar.classList.remove('menu-active');
        }
        
        // Fermer le dropdown d'info
        if (infoDropdown && infoBtn && !infoDropdown.contains(e.target) && !infoBtn.contains(e.target)) {
            infoDropdown.classList.remove('show');
        }
    });
    
    // Fonction pour ajouter des boutons de suppression aux messages existants
    function initDeleteButtons() {
        // Sélectionne tous les types de messages
        const allMessages = document.querySelectorAll('.message');
        
        allMessages.forEach(message => {
            if (!message.querySelector('.delete-btn')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="bx bx-trash"></i>';
                deleteBtn.style.opacity = '1'; // Rendre le bouton visible par défaut

                deleteBtn.addEventListener('click', () => {
                    if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
                        message.remove();
                    }
                });
                message.appendChild(deleteBtn);
            }
        });
    }
    
    // Initialiser les boutons de suppression
    initDeleteButtons();
    
    // Observer les nouveaux messages ajoutés
    const observer = new MutationObserver(() => {
        initDeleteButtons();
    });
    
    // Configurer l'observation
    if (chatMessages) {
        observer.observe(chatMessages, { 
            childList: true, 
            subtree: true 
        });
    }
    
    console.log('Script de messagerie initialisé avec succès');
});