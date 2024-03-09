const express = require('express');
const fs = require('fs');
const path = require('path'); // Added for path handling

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port
const userFile = path.join(__dirname, 'users.txt'); // Use path.join for cross-platform compatibility

// Function to read user data
const getUsers = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(userFile, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data || ''); // Resolve with empty string if no data
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
    res.status(500).send('Error retrieving users.'); // Internal Server Error
  }
});

// Route handler for "/create"
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'create.html')); // Send create.html file
});

// Route handler for "/add" (POST request)
app.post('/add', express.urlencoded({ extended: true }), async (req, res) => {
  const userName = req.body.userName;

  try {
    await fs.promises.appendFile(userFile, userName + '\n'); // Use fs.promises for async/await
    res.redirect('/users'); // Redirect to /users after successful addition
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Error adding user.'); // Internal Server Error
  }
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log errors
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});