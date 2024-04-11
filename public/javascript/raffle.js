document.addEventListener('DOMContentLoaded', function() {
    loadRaffles();
    setupCreateRaffleButton();
    handleRaffleFormSubmission();
    setupShowExpiredButton();
    showExpiredRaffles(); // Initially show expired raffles if any
});

function getRafflesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('raffles')) || [];
}

function saveRafflesToLocalStorage(raffles) {
    localStorage.setItem('raffles', JSON.stringify(raffles));
}

function loadRaffles() {
    let raffles = getRafflesFromLocalStorage();
    const now = new Date().getTime();
    raffles = raffles.filter(raffle => {
        // Remove raffles expired for more than 24 hours
        if (raffle.status === 'completed' && now - new Date(raffle.endTime).getTime() > 24 * 60 * 60 * 1000) {
            return false;
        }
        return true;
    });
    saveRafflesToLocalStorage(raffles); // Update local storage after cleanup
    displayRaffles(raffles.filter(raffle => raffle.status === 'active')); // Display only active raffles
}

function displayRaffles(raffles) {
    const list = document.getElementById('raffle-list');
    list.innerHTML = ''; // Clear existing raffles
    raffles.forEach(raffle => addRaffleToList(raffle));
    initializeAllCountdowns();
}

function addRaffleToList({name, description, endTime, id, status}) {
    const list = document.getElementById('raffle-list');
    const article = document.createElement('article');
    article.classList.add('raffle-entry');
    article.dataset.id = id;
    article.dataset.status = status;
    article.innerHTML = `
        <h2>${name}</h2>
        <img src="placeholder-image.jpg" alt="${name}" class="raffle-img">
        <p class="raffle-description">${description}</p>
        <div class="raffle-timer" data-countdown="${endTime}">Calculating time left...</div>
        <button class="raffle-enter" onclick="enterRaffle(this, '${id}')">${status === 'active' ? 'Enter Raffle' : 'Raffle Ended'}</button>
    `;
    if (status === 'active') {
        list.appendChild(article);
    }
}

function setupCreateRaffleButton() {
    const btn = document.getElementById('create-raffle-btn');
    btn.addEventListener('click', () => {
        document.getElementById('create-raffle').classList.toggle('hidden');
    });
}

function handleRaffleFormSubmission() {
    const form = document.querySelector('#create-raffle form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const newRaffle = {
            name: formData.get('prize-name'),
            description: formData.get('prize-description'),
            endTime: formData.get('end-time'),
            id: Date.now().toString(),
            status: 'active'
        };
        addRaffle(newRaffle);
        form.reset();
        document.getElementById('create-raffle').classList.add('hidden');
        alert('Raffle created successfully!');
    });
}

function addRaffle(raffle) {
    const raffles = getRafflesFromLocalStorage();
    raffles.push(raffle);
    saveRafflesToLocalStorage(raffles);
    if (raffle.status === 'active') {
        addRaffleToList(raffle);
    }
}

function enterRaffle(button, raffleId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to enter a raffle');
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    fetch('/api/enroll-raffle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ raffleId, name, email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problem enrolling in raffle');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message + " An email will be sent to you if you win.");
        button.disabled = true;
        button.innerText = 'Enrolled';
    })
    .catch(error => {
        console.error('Error enrolling in raffle:', error);
        alert('Failed to enroll in raffle.');
    });
}

function showExpiredRafflesPopup(expiredRaffles) {
    // You can implement a pop-up or modal to display expired raffles and winners here
}

function showExpiredRaffles() {
    fetch('/api/expired-raffles')
    .then(response => response.json())
    .then(expiredRaffles => {
        showExpiredRafflesPopup(expiredRaffles);
    })
    .catch(error => console.error('Error fetching expired raffles:', error));
}

function initializeAllCountdowns() {
    document.querySelectorAll('.raffle-timer').forEach(timer => {
        const endTime = new Date(timer.dataset.countdown).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const timeLeft = endTime - now;
            if (timeLeft < 0) {
                clearInterval(interval);
                timer.innerHTML = "Raffle Ended";
                const button = timer.nextElementSibling;
                if (button) {
                    button.innerText = "Raffle Ended";
                    button.disabled = true;
                }
                const article = timer.closest('.raffle-entry');
                updateRaffleStatus(article.dataset.id, 'completed');
                return;
            }
            timer.innerHTML = formatTimeLeft(timeLeft);
        }, 1000);
    });
}

function updateRaffleStatus(id, newStatus) {
    const raffles = getRafflesFromLocalStorage();
    const index = raffles.findIndex(raffle => raffle.id === id);
    if (index !== -1) {
        raffles[index].status = newStatus;
        saveRafflesToLocalStorage(raffles);
    }
}

function formatTimeLeft(timeLeft) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function setupShowExpiredButton() {
    const btn = document.getElementById('show-expired-btn');
    btn.addEventListener('click', () => {
        const expiredSection = document.getElementById('expired-raffles');
        expiredSection.classList.toggle('hidden');
        if (!expiredSection.classList.contains('hidden')) {
            showExpiredRaffles();
        }
    });
}