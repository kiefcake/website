document.addEventListener('DOMContentLoaded', () => {
    // Fetch user profile data from the server
    fetch('/api/profile', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return response.json();
    })
    .then(data => {
        // Update the DOM with the user profile data
        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;
        // You can update additional profile information here as needed
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
        // Handle errors, e.g., display an error message to the user
    });

    // Event listener for logout button
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Remove token from local storage
            localStorage.removeItem('token');
            // Redirect the user to the login page
            window.location.href = 'login.html'; // Adjust the path as necessary
        });
    }
});