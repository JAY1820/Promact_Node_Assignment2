const express = require('express');
const fs = require('fs');
const path = require('path');
const middleware = require('./middleware'); 

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;
const userFile = path.join(__dirname, 'users.txt');

// Function to read user data
const getUsers = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(userFile, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data || ''); 
      }
    });
  });
};

// Route handler for "/"
app.get('/', (req, res) => {
  res.send('Hello, welcome to our site!');
});

// Route handler for "/users"
app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (err) {
    console.error('Error reading user data:', err);
    // Internal Server Error
    res.status(500).send('Error retrieving users.'); 
  }
});

// Route handler for "/create"
app.get('/create', (req, res) => {
    // Send create.html file
  res.sendFile(path.join(__dirname, 'create.html')); 
});

// Route handler for "/add" (POST request)
app.post('/add', express.urlencoded({ extended: true }), async (req, res) => {
  const userName = req.body.userName;

  try {
    // Use fs.promises for async/await
    await fs.promises.appendFile(userFile, userName + '\n'); 
     // Redirect to /users after successful addition
    res.redirect('/users');
  } catch (err) {
    console.error('Error adding user:', err);
    // Internal Server Error
    res.status(500).send('Error adding user.'); 
  }
});

// Apply the notFoundHandler middleware to handle any unmatched routes
app.use(middleware.notFoundHandler);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
