const emojiButton = document.querySelector('.emoji-btn');
const input = document.querySelector('.chat-input input');

// Création d'une instance du picker
const picker = new EmojiButton({
    position: 'top-start',
    theme: 'dark', // ou 'light' selon votre préférence
    categories: ['smileys', 'people', 'animals', 'food', 'activities', 'travel', 'objects', 'symbols', 'flags']
});

// Événement pour afficher le picker
emojiButton.addEventListener('click', () => {
    picker.togglePicker(emojiButton);
});

// Événement lors de la sélection d'un emoji
picker.on('emoji', selection => {
    // Insérer l'emoji à la position du curseur
    const cursorPosition = input.selectionStart;
    const text = input.value;
    const before = text.substring(0, cursorPosition);
    const after = text.substring(cursorPosition);
    input.value = before + selection.emoji + after;
    
    // Replacer le curseur après l'emoji
    const newCursorPosition = cursorPosition + selection.emoji.length;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
    input.focus();
});