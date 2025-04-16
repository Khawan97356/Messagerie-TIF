class MessageStatus {
    constructor() {
        this.messageStates = {
            SENT: 'sent',
            DELIVERED: 'delivered',
            READ: 'read'
        };
    }

    updateStatus(messageElement, status) {
        const statusElement = messageElement.querySelector('.message-status');
        if (!statusElement) return;

        // Supprimer les classes existantes
        Object.values(this.messageStates).forEach(state => {
            statusElement.classList.remove(state);
        });

        // Ajouter la nouvelle classe
        statusElement.classList.add(status);

        // Mettre à jour l'icône
        const icon = statusElement.querySelector('i');
        if (icon) {
            icon.className = 'bx';
            switch (status) {
                case this.messageStates.SENT:
                    icon.classList.add('bx-check');
                    break;
                case this.messageStates.DELIVERED:
                    icon.classList.add('bx-check-double');
                    break;
                case this.messageStates.READ:
                    icon.classList.add('bx-check-double');
                    break;
            }
        }
    }

    // Simuler la progression du statut du message
    simulateMessageProgress(messageElement) {
        // Envoyé
        this.updateStatus(messageElement, this.messageStates.SENT);

        // Livré après 1 seconde
        setTimeout(() => {
            this.updateStatus(messageElement, this.messageStates.DELIVERED);
        }, 1000);

        // Lu après 2 secondes
        setTimeout(() => {
            this.updateStatus(messageElement, this.messageStates.READ);
        }, 2000);
    }
}

// Initialisation
const messageStatus = new MessageStatus();

// Appliquer aux messages existants
document.querySelectorAll('.message.sent').forEach(message => {
    messageStatus.simulateMessageProgress(message);
});

// Pour les nouveaux messages
// À appeler lors de l'envoi d'un nouveau message
function onNewMessageSent(messageElement) {
    messageStatus.simulateMessageProgress(messageElement);
}