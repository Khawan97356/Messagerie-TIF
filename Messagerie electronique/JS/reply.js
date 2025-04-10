let replyingTo = null;

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const replyPreview = chatInput.querySelector('.reply-preview');
    const replyToText = replyPreview.querySelector('.reply-to-text');
    const cancelReplyBtn = replyPreview.querySelector('.cancel-reply');

    // Gérer les clics sur les boutons de réponse
    chatMessages.addEventListener('click', (e) => {
        if (e.target.closest('.reply-btn')) {
            const messageElement = e.target.closest('.message');
            startReply(messageElement);
        }
    });

    // Fonction pour démarrer une réponse
    function startReply(messageElement) {
        replyingTo = messageElement;
        const messageText = messageElement.querySelector('p').textContent;
        
        // Afficher l'aperçu de la réponse
        replyPreview.style.display = 'flex';
        replyToText.textContent = `Réponse à: ${messageText.substring(0, 50)}...`;
        
        // Mettre en évidence le message auquel on répond
        messageElement.classList.add('replying-to');
        
        // Focus sur le champ de saisie
        chatInput.querySelector('input[type="text"]').focus();
    }

    // Annuler la réponse
    cancelReplyBtn.addEventListener('click', () => {
        cancelReply();
    });

    function cancelReply() {
        if (replyingTo) {
            replyingTo.classList.remove('replying-to');
            replyingTo = null;
            replyPreview.style.display = 'none';
            replyToText.textContent = '';
        }
    }

    // Modifier la fonction d'envoi de message existante
    const sendButton = chatInput.querySelector('.send-btn');
    const messageInput = chatInput.querySelector('input[type="text"]');

    sendButton.addEventListener('click', () => {
        if (messageInput.value.trim()) {
            sendMessage(messageInput.value, replyingTo);
            messageInput.value = '';
            cancelReply();
        }
    });

    function sendMessage(text, replyTo) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent');

        let messageContent = '';
        
        if (replyTo) {
            const replyText = replyTo.querySelector('p').textContent;
            messageContent += `
                <div class="message-reply-container">
                    <div class="reply-preview">
                        ${replyText.substring(0, 50)}...
                    </div>
                </div>
            `;
        }

        messageContent += `
            <div class="message-actions">
                <button class="reply-btn" title="Répondre">
                    <i class='bx bx-reply'></i>
                </button>
                <button class="edit-btn" title="Modifier">
                    <i class='bx bx-edit'></i>
                </button>
            </div>
            <p>${text}</p>
            <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        `;

        messageDiv.innerHTML = messageContent;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});