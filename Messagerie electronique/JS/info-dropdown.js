document.addEventListener('DOMContentLoaded', () => {
    const infoBtn = document.querySelector('.info-btn');
    const infoDropdown = document.querySelector('.info-dropdown');
    const notesPanel = document.querySelector('.notes-panel');
    const mediaGallery = document.querySelector('.media-gallery');
    const searchMessages = document.querySelector('.search-messages');

    // Gérer l'affichage du menu déroulant
    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoDropdown.classList.toggle('show');
    });

    // Gérer les clics sur les options du menu
    infoDropdown.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.currentTarget.textContent.trim();

            switch(action) {
                case 'Voir le profile':
                    // Afficher le profil
                    console.log('Affichage du profil');
                    break;
                    
                case 'Recherche':
                    searchMessages.style.display = 'block';
                    break;
                    
                case 'Media et Liens':
                    mediaGallery.style.display = 'block';
                    break;
                    
                case 'Mode Silencieux':
                    toggleSilentMode();
                    break;
                    
                case 'Messages éphémeres':
                    // Activer les messages éphémères
                    console.log('Messages éphémères activés');
                    break;
                    
                case 'Notes personnelles':
                    notesPanel.style.display = 'block';
                    break;
                    
                case 'Plus':
                    // Gérer les options supplémentaires
                    console.log('Plus d\'options');
                    break;
            }
            
            // Fermer le menu après la sélection
            infoDropdown.classList.remove('show');
        });
    });

    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!infoDropdown.contains(e.target) && !infoBtn.contains(e.target)) {
            infoDropdown.classList.remove('show');
        }
    });

    function toggleSilentMode() {
        const isSilent = !infoBtn.classList.contains('silent-mode');
        infoBtn.classList.toggle('silent-mode');
        console.log(`Mode silencieux ${isSilent ? 'activé' : 'désactivé'}`);
    }
});