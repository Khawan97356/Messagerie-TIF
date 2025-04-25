document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.media-gallery');
    const mediaGrid = document.querySelector('.media-grid');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const closeGalleryBtn = document.querySelector('.close-gallery');
    
    // Simulation de médias partagés (à remplacer par vos données réelles)
    const sharedMedia = {
        images: [
            { type: 'image', url: 'https://via.placeholder.com/150', date: '2024-04-18' },
            { type: 'image', url: 'https://via.placeholder.com/150', date: '2024-04-17' }
        ],
        videos: [
            { type: 'video', url: 'video1.mp4', thumbnail: 'https://via.placeholder.com/150', date: '2024-04-16' }
        ],
        files: [
            { type: 'file', name: 'document.pdf', size: '2.5MB', date: '2024-04-15' }
        ]
    };

    function showGallery() {
        gallery.style.display = 'flex';
        renderMediaGrid('all');
    }

    function hideGallery() {
        gallery.style.display = 'none';
    }

    function renderMediaGrid(type) {
        mediaGrid.innerHTML = '';
        let mediaToShow = [];

        if (type === 'all') {
            mediaToShow = [
                ...sharedMedia.images,
                ...sharedMedia.videos,
                ...sharedMedia.files
            ];
        } else {
            mediaToShow = sharedMedia[type] || [];
        }

        mediaToShow.forEach(media => {
            const mediaElement = createMediaElement(media);
            mediaGrid.appendChild(mediaElement);
        });
    }

    function createMediaElement(media) {
        const div = document.createElement('div');
        div.className = 'media-item';

        switch (media.type) {
            case 'image':
                div.innerHTML = `<img src="${media.url}" alt="Image partagée">`;
                break;
            case 'video':
                div.innerHTML = `
                    <img src="${media.thumbnail}" alt="Miniature vidéo">
                    <i class='bx bx-play-circle'></i>
                `;
                break;
            case 'file':
                div.className += ' file';
                div.innerHTML = `
                    <i class='bx bx-file'></i>
                    <span>${media.name}</span>
                `;
                break;
        }

        return div;
    }

    // Event Listeners
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMediaGrid(btn.dataset.type);
        });
    });

    closeGalleryBtn.addEventListener('click', hideGallery);

    // Ajouter un bouton pour ouvrir la galerie dans les actions du chat
    const chatActions = document.querySelector('.chat-actions');
    const galleryBtn = document.createElement('button');
    galleryBtn.className = 'action-btn';
    galleryBtn.innerHTML = '<i class="bx bx-images"></i>';
    galleryBtn.addEventListener('click', showGallery);
    chatActions.insertBefore(galleryBtn, chatActions.firstChild);
});