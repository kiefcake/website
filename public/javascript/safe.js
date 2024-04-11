document.addEventListener('DOMContentLoaded', function() {
    cleanUpExpiredRaffles();
});

function cleanUpExpiredRaffles() {
    let raffles = JSON.parse(localStorage.getItem('raffles')) || [];
    const now = new Date().getTime();
    
    const activeOrRecentRaffles = raffles.filter(raffle => {
        const endTime = new Date(raffle.endTime).getTime();
        return !(raffle.status === 'completed' && now - endTime > 24 * 60 * 60 * 1000);
    });


    localStorage.setItem('raffles', JSON.stringify(activeOrRecentRaffles));
}

function backupRaffles(raffles) {
    console.log('Backup raffles (to be implemented):', raffles);
}

function checkDataIntegrity() {
    console.log('Check data integrity (to be implemented)');
}