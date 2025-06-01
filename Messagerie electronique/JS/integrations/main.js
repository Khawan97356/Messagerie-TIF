/**
 * Module principal d'initialisation des intégrations
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les intégrations
    CalendarIntegration.init();
    CloudIntegration.init();
    PluginsAPI.init();
    WidgetsManager.init();
    VoiceAssistant.init();
    
    // Gestion des menus et boutons d'intégration
    initIntegrationMenus();
    
    console.log('✅ Toutes les intégrations ont été initialisées');
});

/**
 * Initialisation des menus et interactions UI pour les intégrations
 */
function initIntegrationMenus() {
    // Toggle du sous-menu d'intégrations dans la barre latérale
    const integrationToggle = document.querySelector('.integrations-toggle');
    const integrationsSubmenu = document.querySelector('.integrations-submenu');
    
    if (integrationToggle && integrationsSubmenu) {
        integrationToggle.addEventListener('click', function(e) {
            e.preventDefault();
            integrationsSubmenu.classList.toggle('active');
        });
    }
    
    // Gestion des boutons d'ouverture des modales d'intégration
    setupModalTriggers('.calendar-integration-btn', '.calendar-modal');
    setupModalTriggers('.cloud-integration-btn', '.cloud-modal');
    setupModalTriggers('.plugins-btn', '.plugins-modal');
    setupModalTriggers('.widgets-btn', '.widgets-modal');
    setupModalTriggers('.voice-assistant-btn', '.voice-assistant-modal');
    
    // Boutons d'intégration rapide dans la barre de chat
    setupModalTriggers('.quick-calendar-btn', '.calendar-modal');
    setupModalTriggers('.quick-cloud-btn', '.cloud-modal');
    
    // Menu d'intégration rapide
    const quickIntegrationBtn = document.querySelector('.quick-integration-btn');
    const quickIntegrationMenu = document.querySelector('.quick-integration-menu');
    
    if (quickIntegrationBtn && quickIntegrationMenu) {
        quickIntegrationBtn.addEventListener('click', function() {
            quickIntegrationMenu.style.display = quickIntegrationMenu.style.display === 'none' ? 'flex' : 'none';
        });
        
        // Fermer le menu au clic à l'extérieur
        document.addEventListener('click', function(e) {
            if (!quickIntegrationBtn.contains(e.target) && !quickIntegrationMenu.contains(e.target)) {
                quickIntegrationMenu.style.display = 'none';
            }
        });
    }
    
    // Fermeture des modales
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = button.closest('.integration-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Gestion des onglets dans les modales
    initTabsInModals();
}

/**
 * Configure les déclencheurs de modales
 */
function setupModalTriggers(triggerSelector, modalSelector) {
    const triggers = document.querySelectorAll(triggerSelector);
    const modal = document.querySelector(modalSelector);
    
    if (!modal || triggers.length === 0) return;
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fermer toutes les autres modales d'abord
            document.querySelectorAll('.integration-modal').forEach(m => {
                m.style.display = 'none';
            });
            
            // Afficher la modale ciblée
            modal.style.display = 'block';
        });
    });
}

/**
 * Initialise les systèmes d'onglets dans les modales
 */
function initTabsInModals() {
    // Pour chaque groupe d'onglets
    const tabGroups = [
        {tabs: '.calendar-tab', contents: '.calendar-tab-content'},
        {tabs: '.cloud-tab', contents: '.cloud-tab-content'},
        {tabs: '.plugin-tab', contents: '.plugin-tab-content'},
        {tabs: '.widget-tab', contents: '.widget-tab-content'},
        {tabs: '.voice-tab', contents: '.voice-tab-content'}
    ];
    
    tabGroups.forEach(group => {
        const tabButtons = document.querySelectorAll(group.tabs);
        
        tabButtons.forEach(tab => {
            tab.addEventListener('click', function() {
                // Retirer la classe active de tous les onglets
                tabButtons.forEach(t => t.classList.remove('active'));
                
                // Ajouter la classe active à l'onglet cliqué
                tab.classList.add('active');
                
                // Cacher tous les contenus d'onglets
                const contents = document.querySelectorAll(group.contents);
                contents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // Afficher le contenu de l'onglet sélectionné
                const tabData = tab.getAttribute('data-tab');
                const activeContent = document.getElementById(`${tabData}-tab`);
                if (activeContent) {
                    activeContent.style.display = 'block';
                }
            });
        });
    });
}