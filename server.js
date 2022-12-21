// Files to require
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// create a port and const for app express
const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded for data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for Notes Page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/assets/notes.html'))
); 

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

//   add code to listen for something on the PORT
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);