let editingMessage = null;

document.addEventListener('DOMContentLoaded', () => {
    // Écouter les clics sur les boutons de modification
    document.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const messageElement = e.target.closest('.message');
            startEditing(messageElement);
        }
    });
});

function startEditing(messageElement) {
    // Vérifier si c'est un message envoyé
    if (!messageElement.classList.contains('sent')) return;

    const messageText = messageElement.querySelector('p');
    const originalText = messageText.textContent;
    editingMessage = messageElement;

    // Créer un champ de texte pour l'édition
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = originalText;
    editInput.classList.add('edit-input');

    // Créer les boutons de confirmation et d'annulation
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('edit-buttons');
    buttonsContainer.innerHTML = `
        <button class="confirm-edit"><i class='bx bx-check'></i></button>
        <button class="cancel-edit"><i class='bx bx-x'></i></button>
    `;

    // Remplacer le texte par le champ d'édition
    messageText.style.display = 'none';
    messageElement.insertBefore(editInput, messageText);
    messageElement.appendChild(buttonsContainer);

    // Focus sur le champ de texte
    editInput.focus();

    // Gérer la confirmation de l'édition
    buttonsContainer.querySelector('.confirm-edit').addEventListener('click', () => {
        confirmEdit(messageElement, editInput.value);
    });

    // Gérer l'annulation de l'édition
    buttonsContainer.querySelector('.cancel-edit').addEventListener('click', () => {
        cancelEdit(messageElement);
    });

    // Gérer la touche Entrée pour confirmer
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmEdit(messageElement, editInput.value);
        }
    });
}

function confirmEdit(messageElement, newText) {
    const messageText = messageElement.querySelector('p');
    const editInput = messageElement.querySelector('.edit-input');
    const buttonsContainer = messageElement.querySelector('.edit-buttons');

    // Mettre à jour le texte
    messageText.textContent = newText;
    messageText.style.display = 'block';

    // Supprimer les éléments d'édition
    editInput.remove();
    buttonsContainer.remove();

    // Ajouter l'indication "modifié"
    const editedSpan = document.createElement('span');
    editedSpan.classList.add('edited-indicator');
    editedSpan.textContent = '(modifié)';
    messageText.appendChild(editedSpan);

    editingMessage = null;
}

function cancelEdit(messageElement) {
    const messageText = messageElement.querySelector('p');
    const editInput = messageElement.querySelector('.edit-input');
    const buttonsContainer = messageElement.querySelector('.edit-buttons');

    // Restaurer l'affichage original
    messageText.style.display = 'block';
    editInput.remove();
    buttonsContainer.remove();

    editingMessage = null;
}