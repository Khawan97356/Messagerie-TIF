const tagFilterBtn = document.querySelector('.tag-filter-btn');
const tags = ['important', 'work', 'personal', 'urgent'];

function initializeTags() {
    tagFilterBtn.addEventListener('click', () => {
        showTagFilterMenu();
    });
}

function showTagFilterMenu() {
    const menu = document.createElement('div');
    menu.className = 'tag-filter-menu';
    
    tags.forEach(tag => {
        const tagOption = document.createElement('div');
        tagOption.className = 'tag-option';
        tagOption.innerHTML = `
            <input type="checkbox" id="${tag}" name="${tag}">
            <label for="${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</label>
        `;
        menu.appendChild(tagOption);
    });

    // Positionnement du menu
    tagFilterBtn.appendChild(menu);

    // Fermeture du menu en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== tagFilterBtn) {
            menu.remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeTags);