/**
 * Module d'intégration avec les services de calendrier
 */
const CalendarIntegration = (function() {
    // Stockage des calendriers connectés
    let connectedCalendars = {
        google: {
            connected: true,
            displayName: 'Google Calendar',
            accountEmail: 'utilisateur@gmail.com'
        },
        outlook: {
            connected: false,
            displayName: 'Outlook Calendar',
            accountEmail: ''
        },
        apple: {
            connected: false,
            displayName: 'Apple Calendar',
            accountEmail: ''
        }
    };
    
    // Stockage des événements
    let events = [
        {
            id: '1',
            title: 'Réunion d\'équipe',
            date: new Date(new Date().setHours(14, 0, 0, 0)),
            duration: 60, // minutes
            location: 'Salle de conférence virtuelle',
            description: 'Réunion hebdomadaire',
            calendar: 'google',
            color: '#4285F4',
            participants: ['john@example.com', 'alice@example.com']
        },
        {
            id: '2',
            title: 'Appel client',
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
            time: '10:00',
            duration: 30,
            location: 'Google Meet',
            description: 'Présentation du nouveau produit',
            calendar: 'google',
            color: '#34A853',
            participants: ['client@enterprise.com']
        }
    ];
    
    /**
     * Initialise l'intégration calendrier
     */
    function init() {
        console.log('Initialisation de l\'intégration calendrier...');
        
        // Écouter les événements dans les onglets calendrier
        setupCalendarTabEvents();
        
        // Configurer les intégrations rapides de calendrier
        setupQuickCalendarInsert();
        
        // Charger les événements pour aujourd'hui
        loadEvents('today');
    }
    
    /**
     * Configure les interactions avec les onglets du calendrier
     */
    function setupCalendarTabEvents() {
        // Gestion des connexions/déconnexions
        const connectButtons = document.querySelectorAll('.connect-btn');
        const disconnectButtons = document.querySelectorAll('.disconnect-btn');
        
        connectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const serviceItem = button.closest('.service-item');
                const serviceName = serviceItem.querySelector('span').textContent.trim().toLowerCase();
                
                // Simuler l'authentification OAuth
                simulateOAuthFlow(serviceName)
                    .then(success => {
                        if (success) {
                            updateCalendarConnectionUI(serviceItem, true);
                        }
                    });
            });
        });
        
        disconnectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const serviceItem = button.closest('.service-item');
                const serviceName = serviceItem.querySelector('span').textContent.trim().toLowerCase();
                
                // Déconnecter le service
                disconnectCalendarService(serviceName);
                updateCalendarConnectionUI(serviceItem, false);
            });
        });
        
        // Formulaire de création d'événement
        const eventForm = document.querySelector('.event-form');
        if (eventForm) {
            eventForm.addEventListener('submit', function(e) {
                e.preventDefault();
                createNewEvent();
            });
        }
        
        // Filtres d'événements
        const timeFilter = document.querySelector('.time-filter');
        if (timeFilter) {
            timeFilter.addEventListener('change', function() {
                loadEvents(this.value);
            });
        }
    }
    
    /**
     * Simule un flux d'authentification OAuth
     */
    function simulateOAuthFlow(serviceName) {
        return new Promise((resolve) => {
            console.log(`Démarrage du flux d'authentification pour ${serviceName}...`);
            
            // Simuler un délai de connexion
            setTimeout(() => {
                // Dans une implémentation réelle, ouvrirait une fenêtre OAuth
                // et attendrait la redirection avec le token
                
                const success = true; // Supposons que l'authentification réussit
                
                if (success) {
                    // Mettre à jour notre état interne
                    if (connectedCalendars[serviceName.toLowerCase()]) {
                        connectedCalendars[serviceName.toLowerCase()].connected = true;
                        connectedCalendars[serviceName.toLowerCase()].accountEmail = 'utilisateur@example.com';
                    }
                    
                    console.log(`✅ Authentification réussie pour ${serviceName}`);
                }
                
                resolve(success);
            }, 1500);
        });
    }
    
    /**
     * Met à jour l'interface utilisateur pour refléter l'état de connexion
     */
    function updateCalendarConnectionUI(serviceItem, isConnected) {
        const statusElement = serviceItem.querySelector('.connection-status');
        const button = serviceItem.querySelector('button');
        
        if (isConnected) {
            statusElement.textContent = 'Connecté';
            statusElement.className = 'connection-status connected';
            button.textContent = 'Déconnecter';
            button.className = 'disconnect-btn';
        } else {
            statusElement.textContent = 'Non connecté';
            statusElement.className = 'connection-status';
            button.textContent = 'Connecter';
            button.className = 'connect-btn';
        }
    }
    
    /**
     * Déconnecte un service de calendrier
     */
    function disconnectCalendarService(serviceName) {
        console.log(`Déconnexion du service ${serviceName}...`);
        
        // Dans une implémentation réelle, révoquerait les tokens d'accès
        
        // Mettre à jour notre état interne
        if (connectedCalendars[serviceName.toLowerCase()]) {
            connectedCalendars[serviceName.toLowerCase()].connected = false;
            connectedCalendars[serviceName.toLowerCase()].accountEmail = '';
        }
    }
    
    /**
     * Crée un nouvel événement à partir du formulaire
     */
    function createNewEvent() {
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const duration = document.getElementById('event-duration').value;
        const calendar = document.getElementById('event-calendar').value;
        const location = document.getElementById('event-location').value;
        const description = document.getElementById('event-description').value;
        
        if (!title || !date || !time) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        // Créer l'objet événement
        const newEvent = {
            id: 'evt_' + Date.now(),
            title,
            date: new Date(`${date}T${time}`),
            duration: parseInt(duration),
            location,
            description,
            calendar,
            color: getCalendarColor(calendar),
            participants: getParticipantsFromUI()
        };
        
        console.log('Nouvel événement créé:', newEvent);
        
        // Dans une implémentation réelle, enverrait cet événement à l'API du calendrier
        
        // Ajouter l'événement à notre liste locale
        events.push(newEvent);
        
        // Afficher une confirmation
        alert('Événement créé avec succès !');
        
        // Réinitialiser le formulaire
        document.querySelector('.event-form').reset();
        
        // Passer à l'onglet de visualisation
        const viewTab = document.querySelector('[data-tab="view"]');
        if (viewTab) viewTab.click();
        
        // Mettre à jour la liste des événements
        loadEvents('all');
    }
    
    /**
     * Récupère les participants depuis l'interface
     */
    function getParticipantsFromUI() {
        // Dans une implémentation réelle, récupérerait la liste des participants depuis l'UI
        return []; 
    }
    
    /**
     * Récupère la couleur associée à un calendrier
     */
    function getCalendarColor(calendarType) {
        const colors = {
            'google': '#4285F4',
            'outlook': '#0078D4',
            'apple': '#FF2D55'
        };
        
        return colors[calendarType] || '#7986CB';
    }
    
    /**
     * Charge les événements selon la période sélectionnée
     */
    function loadEvents(timeframe) {
        console.log(`Chargement des événements pour la période: ${timeframe}`);
        
        // Dans une implémentation réelle, ferait une requête à l'API du calendrier
        
        // Filtrer les événements selon la période
        let filteredEvents = [];
        const now = new Date();
        
        switch(timeframe) {
            case 'today':
                filteredEvents = events.filter(event => 
                    event.date.toDateString() === now.toDateString()
                );
                break;
            case 'tomorrow':
                const tomorrow = new Date();
                tomorrow.setDate(now.getDate() + 1);
                filteredEvents = events.filter(event => 
                    event.date.toDateString() === tomorrow.toDateString()
                );
                break;
            case 'week':
                const weekEnd = new Date();
                weekEnd.setDate(now.getDate() + 7);
                filteredEvents = events.filter(event => 
                    event.date >= now && event.date <= weekEnd
                );
                break;
            case 'month':
                const monthEnd = new Date();
                monthEnd.setMonth(now.getMonth() + 1);
                filteredEvents = events.filter(event => 
                    event.date >= now && event.date <= monthEnd
                );
                break;
            default:
                filteredEvents = events;
        }
        
        // Mettre à jour l'interface
        updateEventsListUI(filteredEvents);
    }
    
    /**
     * Met à jour l'interface avec la liste des événements
     */
    function updateEventsListUI(eventsList) {
        const eventsContainer = document.querySelector('.events-list');
        if (!eventsContainer) return;
        
        // Vider le conteneur
        eventsContainer.innerHTML = '';
        
        if (eventsList.length === 0) {
            eventsContainer.innerHTML = '<p class="no-events">Aucun événement pour cette période</p>';
            return;
        }
        
        // Trier les événements par date
        eventsList.sort((a, b) => a.date - b.date);
        
        // Créer les éléments pour chaque événement
        eventsList.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            
            const eventDate = event.date;
            const hours = eventDate.getHours().toString().padStart(2, '0');
            const minutes = eventDate.getMinutes().toString().padStart(2, '0');
            const dateStr = eventDate.toLocaleDateString();
            const timeStr = `${hours}:${minutes}`;
            
            const endTime = new Date(eventDate.getTime() + event.duration * 60000);
            const endHours = endTime.getHours().toString().padStart(2, '0');
            const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
            const endTimeStr = `${endHours}:${endMinutes}`;
            
            eventItem.innerHTML = `
                <div class="event-color" style="background-color: ${event.color};"></div>
                <div class="event-details">
                    <h5>${event.title}</h5>
                    <span class="event-time">${dateStr}, ${timeStr} - ${endTimeStr}</span>
                    <span class="event-location">${event.location}</span>
                </div>
                <div class="event-actions">
                    <button class="share-event-btn" title="Partager cet événement" data-event-id="${event.id}">
                        <i class="bx bx-share"></i>
                    </button>
                    <button class="edit-event-btn" title="Modifier" data-event-id="${event.id}">
                        <i class="bx bx-edit"></i>
                    </button>
                </div>
            `;
            
            eventsContainer.appendChild(eventItem);
        });
        
        // Ajouter les écouteurs d'événements pour le partage et l'édition
        setupEventActions();
    }
    
    /**
     * Configure les actions sur les événements (partage, édition)
     */
    function setupEventActions() {
        // Boutons de partage d'événements
        const shareButtons = document.querySelectorAll('.share-event-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                shareEvent(eventId);
            });
        });
        
        // Boutons d'édition d'événements
        const editButtons = document.querySelectorAll('.edit-event-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                editEvent(eventId);
            });
        });
    }
    
    /**
     * Partage un événement dans la conversation
     */
    function shareEvent(eventId) {
        console.log(`Partage de l'événement ${eventId} dans la conversation`);
        
        // Trouver l'événement
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        // Dans une implémentation réelle, créerait un message riche dans la conversation
        
        // Simuler l'insertion d'un message avec l'événement
        // Cette fonction devrait être définie dans le script principal de chat
        if (typeof insertEventMessage === 'function') {
            insertEventMessage(event);
        } else {
            alert(`Événement partagé: ${event.title}`);
        }
        
        // Fermer la modale après le partage
        document.querySelector('.calendar-modal').style.display = 'none';
    }
    
    /**
     * Édite un événement existant
     */
    function editEvent(eventId) {
        console.log(`Édition de l'événement ${eventId}`);
        
        // Trouver l'événement
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        // Passer à l'onglet de création
        const createTab = document.querySelector('[data-tab="create"]');
        if (createTab) createTab.click();
        
        // Pré-remplir le formulaire avec les données de l'événement
        document.getElementById('event-title').value = event.title;
        
        // Formater la date pour l'input date
        const dateStr = event.date.toISOString().split('T')[0];
        document.getElementById('event-date').value = dateStr;
        
        // Formater l'heure pour l'input time
        const hours = event.date.getHours().toString().padStart(2, '0');
        const minutes = event.date.getMinutes().toString().padStart(2, '0');
        document.getElementById('event-time').value = `${hours}:${minutes}`;
        
        document.getElementById('event-duration').value = event.duration;
        document.getElementById('event-calendar').value = event.calendar;
        document.getElementById('event-location').value = event.location;
        document.getElementById('event-description').value = event.description;
        
        // Changer le bouton "Créer" en "Mettre à jour"
        const createButton = document.querySelector('.create-event');
        if (createButton) {
            createButton.textContent = 'Mettre à jour';
            createButton.setAttribute('data-editing', eventId);
        }
    }
    
    /**
     * Configure les fonctionnalités d'insertion rapide de calendrier
     */
    function setupQuickCalendarInsert() {
        const quickCalendarBtn = document.querySelector('.quick-calendar');
        if (quickCalendarBtn) {
            quickCalendarBtn.addEventListener('click', function() {
                // Ouvrir la modale de calendrier à l'onglet "Créer"
                document.querySelector('.calendar-modal').style.display = 'block';
                const createTab = document.querySelector('[data-tab="create"]');
                if (createTab) createTab.click();
                
                // Masquer le menu d'intégration rapide
                document.querySelector('.quick-integration-menu').style.display = 'none';
            });
        }
    }
    
    // API publique
    return {
        init,
        getConnectedCalendars: () => connectedCalendars,
        getEvents: () => events,
        createEvent: createNewEvent,
        shareEvent
    };
})();