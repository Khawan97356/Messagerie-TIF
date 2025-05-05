document.addEventListener('DOMContentLoaded', () => {
    const deleteBtns = document.querySelectorAll('.delete-chat-btn');

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const chatItem = btn.closest('.chat-item');
            
            // Afficher une boîte de dialogue de confirmation
            const confirmation = await showConfirmDialog('Êtes-vous sûr de vouloir supprimer cette conversation ?');
            
            if (confirmation) {
                // Animation de suppression
                chatItem.style.animation = 'slideAndFade 0.3s ease forwards';
                
                setTimeout(() => {
                    chatItem.remove();
                    // Ici vous pouvez ajouter la logique pour supprimer la conversation de la base de données
                }, 300);
            }
        });
    });
});

// Fonction pour afficher une boîte de dialogue de confirmation personnalisée
function showConfirmDialog(message) {
    return new Promise((resolve) => {
        const result = confirm(message);
        resolve(result);
    });
}

// Ajouter l'animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideAndFade {
        0% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);