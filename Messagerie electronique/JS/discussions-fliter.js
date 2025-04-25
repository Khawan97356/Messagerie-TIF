document.addEventListener('DOMContentLoaded', () => {
    const filterInput = document.getElementById('discussions-filter');
    const clearButton = document.querySelector('.clear-search');
    const discussions = document.querySelectorAll('.chat-item');

    // Fonction pour filtrer les discussions
    function filterDiscussions(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        
        discussions.forEach(discussion => {
            const username = discussion.querySelector('.chat-info h3').textContent.toLowerCase();
            const lastMessage = discussion.querySelector('.last-message').textContent.toLowerCase();
            
            if (username.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                discussion.classList.remove('hidden');
            } else {
                discussion.classList.add('hidden');
            }
        });

        // Afficher/masquer le bouton de réinitialisation
        clearButton.style.display = searchTerm ? 'block' : 'none';
    }

    // Écouteur d'événement pour la saisie
    filterInput.addEventListener('input', (e) => {
        filterDiscussions(e.target.value);
    });

    // Réinitialiser la recherche
    clearButton.addEventListener('click', () => {
        filterInput.value = '';
        filterDiscussions('');
        filterInput.focus();
    });

    // Raccourci clavier CTRL + F pour focus sur la recherche
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            filterInput.focus();
        }
    });
});