// Switch entre le bouton micro et le bouton envoyer 

document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-btn');

    chatInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            // Changer en bouton d'envoi
            sendButton.innerHTML = '<i class="bx bx-send"></i>';
            sendButton.title = 'Envoyer le message';
        } else {
            // Remettre en bouton micro
            sendButton.innerHTML = '<i class="bx bx-microphone"></i>';
            sendButton.title = 'Enregistrer un message vocal';
        }
    });
});

// Ajout d'animations entre les boutons d'envoi et micro
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-btn');
    
    // Initialiser le bouton avec les deux icones 
    sendButton.innerHTML = '<i class="bx bx-microphone"></i><i class="bx bx-send hide"></i>';

    chatInput.addEventListener('input', function() {
        const micIcon = sendButton.querySelector('.bx-microphone');
        const sendIcon = sendButton.querySelector('.bx-send');

        if (this.value.trim() !== '') {
            // Changer en bouton d'envoi
            micIcon.classList.add('hide');
            sendIcon.classList.remove('hide');
            sendButton.title = 'Envoyer le message';
            sendButton.classList.add('switch');
        } else {
            // Remettre en bouton micro
            micIcon.classList.remove('hide');
            sendIcon.classList.add('hide');
            sendButton.title = 'Enregistrer un message vocal';
            sendButton.classList.remove('switch');
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
