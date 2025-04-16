document.addEventListener('DOMContentLoaded', () => {
    const typingIndicator = document.querySelector('.typing-indicator');
    const messageInput = document.querySelector('.chat-input input[type="text"]');
    let typingTimeout;

    // Simuler la réception d'un événement de frappe
    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    // Événements de frappe
    messageInput.addEventListener('input', () => {
        // Envoyer un signal au serveur que l'utilisateur tape
        // À implémenter avec votre backend
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            // Envoyer un signal au serveur que l'utilisateur a arrêté de taper
            // À implémenter avec votre backend
        }, 2000);
    });

    // Simuler la réception d'un événement (à remplacer par votre logique backend)
    // Exemple de simulation
    setInterval(() => {
        const isTyping = Math.random() > 0.7;
        if (isTyping) {
            showTypingIndicator();
            setTimeout(hideTypingIndicator, 3000);
        }
    }, 5000);
});