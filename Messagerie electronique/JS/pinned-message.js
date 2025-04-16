class PinnedMessages {
    constructor() {
        this.pinnedMessages = new Set();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pin-btn')) {
                const messageElement = e.target.closest('.message');
                this.togglePin(messageElement);
            }

            if (e.target.closest('.unpin-btn')) {
                const pinnedMessage = e.target.closest('.pinned-message');
                const messageId = pinnedMessage.dataset.messageId;
                this.unpinMessage(messageId);
            }
        });
    }

    togglePin(messageElement) {
        const messageId = messageElement.dataset.messageId || Date.now().toString();
        messageElement.dataset.messageId = messageId;

        if (this.pinnedMessages.has(messageId)) {
            this.unpinMessage(messageId);
        } else {
            this.pinMessage(messageElement);
        }
    }

    pinMessage(messageElement) {
        const messageId = messageElement.dataset.messageId;
        const messageContent = messageElement.querySelector('p').textContent;
        const time = messageElement.querySelector('.time').textContent;

        this.pinnedMessages.add(messageId);
        messageElement.classList.add('pinned');
        messageElement.querySelector('.pin-btn').classList.add('active');

        const pinnedMessage = this.createPinnedMessageElement(messageId, messageContent, time);
        document.querySelector('.pinned-messages-list').appendChild(pinnedMessage);
        document.querySelector('.pinned-messages').classList.add('has-pins');
    }

    unpinMessage(messageId) {
        this.pinnedMessages.delete(messageId);
        
        // Supprimer de la liste des messages épinglés
        const pinnedMessage = document.querySelector(`.pinned-message[data-message-id="${messageId}"]`);
        if (pinnedMessage) {
            pinnedMessage.remove();
        }

        // Mettre à jour le message original
        const originalMessage = document.querySelector(`.message[data-message-id="${messageId}"]`);
        if (originalMessage) {
            originalMessage.classList.remove('pinned');
            originalMessage.querySelector('.pin-btn').classList.remove('active');
        }

        // Masquer la section si plus aucun message épinglé
        if (this.pinnedMessages.size === 0) {
            document.querySelector('.pinned-messages').classList.remove('has-pins');
        }
    }

    createPinnedMessageElement(messageId, content, time) {
        const div = document.createElement('div');
        div.className = 'pinned-message';
        div.dataset.messageId = messageId;
        div.innerHTML = `
            <p>${content}</p>
            <span class="time">${time}</span>
            <button class="unpin-btn" title="Désépingler">
                <i class="bx bx-x"></i>
            </button>
        `;
        return div;
    }
}

// Initialiser la fonctionnalité
new PinnedMessages();