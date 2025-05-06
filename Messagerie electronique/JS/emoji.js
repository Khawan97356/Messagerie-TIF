document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM entièrement chargé.");

    const emojiBtn = document.querySelector(".emoji-btn");
    const messageInput = document.querySelector(".chat-input input[type='text']");

    if (!emojiBtn) {
        console.error("Le bouton emoji n'a pas été trouvé !");
        return;
    }

    if (!messageInput) {
        console.error("Le champ de saisie n'a pas été trouvé !");
        return;
    }

    console.log("Initialisation de EmojiButton...");
    const picker = new EmojiButton();

    emojiBtn.addEventListener("click", () => {
        console.log("Bouton emoji cliqué.");
        picker.togglePicker(emojiBtn);
    });

    picker.on("emoji", emoji => {
        console.log(`Emoji sélectionné : ${emoji}`);
        messageInput.value += emoji;
        messageInput.focus();
    });

    console.log("EmojiButton initialisé avec succès !");
});