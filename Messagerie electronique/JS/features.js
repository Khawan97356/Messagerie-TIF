// Gestion des réactions
document.querySelectorAll('.add-reaction-btn').forEach(btn => {
    btn.addEventListener('click', handleReaction);
});

// Gestion des fils de discussion
document.querySelectorAll('.show-thread-btn').forEach(btn => {
    btn.addEventListener('click', toogleThread);
});

// Gestion des traductions
document.querySelectorAll('.translate-btn').forEach(btn => {
    btn.addEventListener('click', translateMessage);
});

// Gestion des rappels
document.querySelectorAll('.reminder-btn').forEach(btn => {
    btn.addEventListener('click', setReminder);
});