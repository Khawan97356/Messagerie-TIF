document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');

    chatMessages.addEventListener('click', (e) => {
        if (e.target.closest('.forward-btn')) {
            const messageElement = e.target.closest('.message');
            const messageText = messageElement.querySelector('p').textContent;
            
            // TODO: Remplacer par votre propre logique de sélection de destinataire
            const recipient = prompt('Entrez le nom du destinataire :');
            
            if (recipient) {
                forwardMessage(messageText, recipient);
            }
        }
    });

    function forwardMessage(messageText, recipient) {
        // Simulation d'envoi de message
        console.log(`Message transféré à ${recipient}: ${messageText}`);
        
        // Afficher une notification
        alert(`Message transféré à ${recipient}`);
    }
});