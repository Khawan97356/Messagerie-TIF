document.addEventListener('DOMContentLoaded', () => {
    const searchPanel = document.querySelector('.search-messages');
    const searchInput = document.getElementById('message-search');
    const closeSearch = document.querySelector('.close-search');
    const resultsCount = document.querySelector('.results-count');
    const resultsList = document.querySelector('.results-list');
    const prevButton = document.querySelector('.prev-result');
    const nextButton = document.querySelector('.next-result');

    let searchResults = [];
    let currentResultIndex = -1;

    // Ajouter un bouton de recherche dans les actions du chat
    const chatActions = document.querySelector('.chat-actions');
    const searchButton = document.createElement('button');
    searchButton.className = 'action-btn';
    searchButton.innerHTML = '<i class="bx bx-search"></i>';
    chatActions.insertBefore(searchButton, chatActions.firstChild);

    // Ouvrir/fermer le panneau de recherche
    searchButton.addEventListener('click', () => {
        searchPanel.style.display = 'block';
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchPanel.style.display = 'none';
        clearSearch();
    });

    // Effectuer la recherche
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm.length < 2) {
            clearSearch();
            return;
        }
        performSearch(searchTerm);
    }, 300));

    function performSearch(searchTerm) {
        const messages = document.querySelectorAll('.chat-messages .message p');
        searchResults = [];
        resultsList.innerHTML = '';

        messages.forEach((message, index) => {
            const text = message.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                searchResults.push({
                    element: message.closest('.message'),
                    text: message.textContent
                });

                const resultItem = createResultItem(message.textContent, searchTerm, index);
                resultsList.appendChild(resultItem);
            }
        });

        updateResultsCount();
        updateNavigationButtons();
    }

    function createResultItem(text, searchTerm, index) {
        const div = document.createElement('div');
        div.className = 'search-result';
        div.innerHTML = highlightText(text, searchTerm);
        div.addEventListener('click', () => {
            navigateToResult(index);
        });
        return div;
    }

    function highlightText(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlighted-text">$1</span>');
    }

    function navigateToResult(index) {
        if (index >= 0 && index < searchResults.length) {
            currentResultIndex = index;
            const result = searchResults[index];
            result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            updateActiveResult();
            updateNavigationButtons();
        }
    }

    prevButton.addEventListener('click', () => {
        if (currentResultIndex > 0) {
            navigateToResult(currentResultIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentResultIndex < searchResults.length - 1) {
            navigateToResult(currentResultIndex + 1);
        }
    });

    function updateResultsCount() {
        resultsCount.textContent = `${searchResults.length} résultat(s) trouvé(s)`;
    }

    function updateNavigationButtons() {
        prevButton.disabled = currentResultIndex <= 0;
        nextButton.disabled = currentResultIndex >= searchResults.length - 1;
    }

    function updateActiveResult() {
        const results = document.querySelectorAll('.search-result');
        results.forEach((result, index) => {
            result.classList.toggle('active', index === currentResultIndex);
        });
    }

    function clearSearch() {
        searchResults = [];
        currentResultIndex = -1;
        resultsList.innerHTML = '';
        resultsCount.textContent = '';
        updateNavigationButtons();
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});