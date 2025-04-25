// Switch entre le bouton micro et le bouton envoyer 

document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.querySelector('.chat-input input[type="text"]');
    const micButton = document.querySelector('.mic-btn');
    const sendButton = document.querySelector('.send-message-btn');

    chatInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            micButton.style.display = 'none';
            sendButton.style.display = 'block';
        } else {
            micButton.style.display = 'block';
            sendButton.style.display = 'none';
        }
    });

    // Gérer l'envoi du message
    sendButton.addEventListener('click', function() {
        const messageText = chatInput.value.trim();
        if (message !== '') {
            // Ajoutez ici la logique d'envoi du message
            messageInput.value = '';
            // Réafficher le bouton micro après l'envoi*
            micButton.style.display = 'block';
            sendButton.style.display = 'none';
        }
    });

    // Gérer l'envoi avec la touche "Entrée"
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && this.value.trim() !== '') {
            e.preventDefault(); // Empêche le saut de ligne
            sendButton.click(); // Simule le clic sur le bouton d'envoi
        }
    });
});


// Interaction des emojis
document.addEventListener('DOMContentLoaded', function() {
    const emojiButton = document.querySelector('.emoji-btn');
    const emojiPicker = document.querySelector('.emoji-picker');
    const chatInput = document.querySelector('.chat-input input');

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
        if (!emojiButton.contains(e.target) && !emojiPicker.contains(event.target)) {
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