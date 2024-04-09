// authentication.js located in public/javascript

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Function to perform a login request
    function login(username, password) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/profile.html';
            } else {
                throw new Error('Login failed.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
        });
    }

    // Function to perform a registration request
    function register(userData) {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Automatically log in the user or direct them to the login page
                login(userData.username, userData.password);
            } else {
                throw new Error('Registration failed.');
            }
        })
        .catch(error => {
            console.error('Registration error:', error);
        });
    }

    // Add event listeners if the forms exist on this page
    if (loginForm) {
        loginForm.addEventListener('submit', event => {
            event.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            login(username, password);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', event => {
            event.preventDefault();
            // Gather registration data from form inputs
            const userData = {
                username: document.getElementById('register-username').value,
                email: document.getElementById('register-email').value,
                password: document.getElementById('register-password').value,
                // Add other fields as necessary
            };
            register(userData);
        });
    }

    // Sign out logic
    const signOutButton = document.getElementById('sign-out');
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            // Redirect to home page or show login form
            window.location.href = '/login.html';
        });
    }
});