// Files to require
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./helpers/uuid');


// create a port and const for app express
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded for data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET Route for Notes Page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
); 

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

// POST Route
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const data = JSON.parse(fs.readFileSync('./db/db.json', "utf8"))
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      
      data.push(newNote)
      fs.writeFileSync('./db/db.json', JSON.stringify(data))
      res.status(200).json(data)
    } else {
      res.status(500).json('Error in posting note');
    }
  });

  app.delete('/api/notes/:id', (req, res) => {
    // console log the delete req
    console.info(`${req.method} request received to delete a note`);
    const data = JSON.parse(fs.readFileSync('./db/db.json', "utf8"))
    const delNote = data.filter((eraseNote) => eraseNote.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(delNote));
    res.json(delNote);
  });


//   add code to listen for something on the PORT
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);