document.addEventListener('DOMContentLoaded', () => {
    const notesBtn = document.querySelector('.notes-btn');
    const notesPanel = document.querySelector('.notes-panel');
    const closeNotesBtn = document.querySelector('.close-notes');
    const saveNotesBtn = document.querySelector('.save-notes');
    const notesTextarea = document.querySelector('.notes-content textarea');

    // Ouvrir/fermer le panneau des notes
    notesBtn.addEventListener('click', () => {
        notesPanel.style.display = 'block';
        loadNotes();
    });

    closeNotesBtn.addEventListener('click', () => {
        notesPanel.style.display = 'none';
    });

    // Sauvegarder les notes
    saveNotesBtn.addEventListener('click', () => {
        const conversationId = getCurrentConversationId(); // À implémenter selon votre logique
        const notes = notesTextarea.value;
        
        // Sauvegarder dans le localStorage (ou votre backend)
        localStorage.setItem(`notes_${conversationId}`, notes);
        
        // Feedback visuel
        showSaveConfirmation();
    });

    function loadNotes() {
        const conversationId = getCurrentConversationId();
        const savedNotes = localStorage.getItem(`notes_${conversationId}`);
        if (savedNotes) {
            notesTextarea.value = savedNotes;
        } else {
            notesTextarea.value = '';
        }
    }

    function showSaveConfirmation() {
        const saveBtn = document.querySelector('.save-notes');
        saveBtn.textContent = 'Enregistré !';
        setTimeout(() => {
            saveBtn.textContent = 'Enregistrer';
        }, 2000);
    }

    function getCurrentConversationId() {
        // À implémenter selon votre logique de gestion des conversations
        return 'conversation_1'; // Exemple
    }
});