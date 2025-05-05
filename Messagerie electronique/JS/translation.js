class TranslationService {
    constructor() {
        this.API_KEY = 'votre_clé_api';
        this.BASE_URL = 'https://translation-api.com/v1/';
    }

    async translateMessage(text, targetLang) {
        try {
            const response = await fetch(`${this.BASE_URL}/translate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    target_language: targetLang
                })
            });

            const data = await response.json();
            return data.translatedText;

        } catch (error) {
            console.error('Erreur de traduction:', error);
            throw error;
        }
    }
}

// Utilisation
document.querySelectorAll('.translate-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        const messageText = this.closest('.message').querySelector('p').textContent;
        const translationService = new TranslationService();
        
        try {
            const translatedText = await translationService.translateMessage(messageText, 'fr');
            const translationContent = this.closest('.message-translation').querySelector('.translation-content');
            
            translationContent.textContent = translatedText;
            translationContent.style.display = 'block';
        } catch (error) {
            alert('Erreur lors de la traduction');
        }
    });
});