document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginToggleButton = document.getElementById('login-toggle');
    const registerToggleButton = document.getElementById('register-toggle');
    const errorMessageElement = document.getElementById('login-error-message');
    const loginStatus = document.getElementById('login-status');
    const signOutButton = document.getElementById('sign-out');

    // Function to toggle visibility of login and register forms
    function toggleForm(isLoginFormVisible) {
        if (isLoginFormVisible) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
        errorMessageElement.style.display = 'none'; // Hide error messages
        loginStatus.textContent = ''; // Clear login status message
        signOutButton.style.display = 'none'; // Hide sign-out button
    }

    // Event listeners for the toggle buttons
    loginToggleButton.addEventListener('click', () => toggleForm(true));
    registerToggleButton.addEventListener('click', () => toggleForm(false));

    // Initial check for login status
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token logic goes here...
    }

    // Sign-out functionality
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            loginStatus.textContent = 'You have been signed out.';
            toggleForm(true); // Show login form after signing out
        });
    }

    // Login form submission handling
    // ... Your login form submission code goes here ...
    
    // Toggle form visibility
    function toggleForm(showLogin) {
        if (showLogin) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
        errorMessageElement.style.display = 'none'; // Hide error messages when toggling forms
    }
    // Event listeners for the toggle buttons
    loginToggleButton.addEventListener('click', () => toggleForm(true));
    registerToggleButton.addEventListener('click', () => toggleForm(false));

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const loginData = {
                username: document.getElementById('login-username').value,
                password: document.getElementById('login-password').value,
            };

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed. Please check your username and password and try again.');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                window.location.href = '/profile.html'; // Redirect to the profile page
            })
            .catch(error => {
                if (errorMessageElement) {
                    errorMessageElement.textContent = error.message;
                    errorMessageElement.style.display = 'block';
                }
            });
        });
    }
});