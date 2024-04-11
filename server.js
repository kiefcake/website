require('dotenv').config(); // Loads environment variables from a .env file into process.env
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public'));

const db = mysql.createConnection({
    host: process.env.DB_HOST, // e.g., 'localhost'
    user: process.env.DB_USER, // e.g., 'root'
    password: process.env.DB_PASSWORD,
    //database: process.env.DB_NAME
      database: "mydatabase"
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Select the database
    db.query('USE ' + process.env.DB_NAME, (error, results) => {
        if (error) {
            console.error('Error selecting database:', error);
            return;
        }
        console.log('Database selected');
    });
});

// User Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if username or email already exists in the database
    const existingUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(existingUserQuery, [username, email], async (error, results) => {
        if (error) {
            console.error('Error checking existing user:', error);
            return res.status(500).send({ message: 'Internal server error.' });
        }

        if (results.length > 0) {
            return res.status(400).send({ message: 'Username or email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [username, email, hashedPassword], (error, results) => {
            if (error) {
                console.error('Error inserting new user:', error);
                return res.status(500).send({ message: 'Internal server error.' });
            }
            return res.status(201).send({ message: 'User registered successfully.' });
        });
    });
});

// User Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Retrieve user from database
    const getUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(getUserQuery, [username], async (error, results) => {
        if (error) {
            console.error('Error retrieving user:', error);
            return res.status(500).send({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const user = results[0];

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ message: 'Incorrect password.' });
        }

        // Create and send JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).send({ token });
    });
});

// Verify Token Endpoint
app.get('/verify', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to authenticate token.' });
        }

        // If everything is good, save to request for use in other routes
        req.userId = decoded.id;
        res.status(200).send({ message: 'The token is valid.', user: decoded });
    });
});

const port = process.env.PORT || 3000; // Default to 3000 if PORT is not defined
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});