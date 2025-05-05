document.addEventListener('DOMContentLoaded', () => {
    const emojiButton = document.querySelector('.emoji-btn');
    const messageInput = document.querySelector('.chat-input input[type="text"]');
    const pickerContainer = document.querySelector('.emoji-picker');

    // Créer le picker d'emoji
    const picker = new EmojiMart.Picker({
        data: async () => {
            const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
            return response.json();
        },
        onEmojiSelect: (emoji) => {
            // Insérer l'emoji dans le champ de texte
            const cursorPos = messageInput.selectionStart;
            const text = messageInput.value;
            messageInput.value = text.slice(0, cursorPos) + emoji.native + text.slice(cursorPos);
            messageInput.focus();
            pickerContainer.style.display = 'none';
        },
        locale: 'fr',
        theme: 'light'
    });

    // Ajouter le picker au conteneur
    pickerContainer.innerHTML = '';
    pickerContainer.appendChild(picker);
    pickerContainer.style.display = 'none';

    // Gérer le clic sur le bouton emoji
    emojiButton.addEventListener('click', (e) => {
        e.stopPropagation();
        pickerContainer.style.display = pickerContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Fermer le picker si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!emojiButton.contains(e.target) && !pickerContainer.contains(e.target)) {
            pickerContainer.style.display = 'none';
        }
    });
});